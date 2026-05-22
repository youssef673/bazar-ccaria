import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { generateOrderNumber } from "@/lib/utils";
import { validateCalabriaDelivery } from "@/lib/calabria";
import { notifyAdmin } from "@/lib/notifications";
import { checkRateLimit } from "@/lib/rate-limit";
import { z } from "zod";
import {
  OrderStatus,
  PaymentStatus,
  type DeliveryMethod,
  type PaymentMethod,
} from "@prisma/client";

const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
  price: z.number().nonnegative(),
  name: z.string().min(1),
  slug: z.string().min(1),
  status: z.string().min(1),
  isPreorder: z.boolean().optional(),
});

const createOrderSchema = z.object({
  customerName: z.string().trim().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().trim().min(8),
  shippingAddress: z.string().trim().optional(),
  shippingCity: z.string().trim().min(1),
  shippingProvince: z.string().trim().min(1),
  shippingCap: z.string().trim().optional(),
  shippingNotes: z.string().trim().optional(),
  deliveryMethod: z.enum(["LOCAL_DELIVERY", "COURIER", "PICKUP"]),
  paymentMethod: z.enum([
    "STRIPE_CARD",
    "PAYPAL",
    "BANK_TRANSFER",
    "CASH_ON_DELIVERY",
    "DEPOSIT",
  ]),
  items: z.array(orderItemSchema).min(1),
  shippingEstimate: z.number().nullable().optional(),
  requiresQuote: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const rateLimit = checkRateLimit(req, "orders", 5, 60_000);
    if (!rateLimit.ok) {
      return NextResponse.json(
        { error: "Troppi tentativi. Riprova tra poco." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const data = createOrderSchema.parse(body);

    if (data.deliveryMethod !== "PICKUP") {
      const check = validateCalabriaDelivery(data.shippingCity, data.shippingProvince);
      if (!check.valid) {
        return NextResponse.json({ error: check.message }, { status: 400 });
      }
    }

    const subtotal = data.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const shippingCost = data.requiresQuote ? null : (data.shippingEstimate ?? 0);
    const isPreorder = data.items.some((i) => i.isPreorder);
    const depositPct = 30;
    let depositAmount: number | null = null;
    let total = subtotal + (shippingCost ?? 0);

    if (data.paymentMethod === "DEPOSIT" || isPreorder) {
      depositAmount = Math.round(total * (depositPct / 100) * 100) / 100;
    }

    // --- stock validation: ensure quantities available unless preorder allowed ---
    const productIds = data.items.map((i) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    const productById: Record<string, any> = {};
    products.forEach((p) => (productById[p.id] = p));

    for (const item of data.items) {
      const p = productById[item.productId];
      if (!p) {
        return NextResponse.json({ error: `Prodotto non trovato: ${item.productId}` }, { status: 400 });
      }
      const isPre = item.isPreorder || p.allowPreorder || p.status === "PREORDER";
      if (!isPre && item.quantity > p.stock) {
        return NextResponse.json({ error: `Quantità richiesta per ${item.name} non disponibile. Disponibili: ${p.stock}` }, { status: 400 });
      }
      if (item.quantity < 1) {
        return NextResponse.json({ error: `Quantità non valida per ${item.name}` }, { status: 400 });
      }
    }

    const subtotal = data.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const shippingCost = data.requiresQuote ? null : (data.shippingEstimate ?? 0);
    const isPreorder = data.items.some((i) => i.isPreorder);
    const depositPct = 30;
    let depositAmount: number | null = null;
    let total = subtotal + (shippingCost ?? 0);

    if (data.paymentMethod === "DEPOSIT" || isPreorder) {
      depositAmount = Math.round(total * (depositPct / 100) * 100) / 100;
    }

    const orderNumber = generateOrderNumber();
    const status = data.requiresQuote ? "QUOTE_REQUESTED" : "PENDING";

    // create order and update stock atomically
    const createOrderData = {
      orderNumber,
      status,
      paymentMethod: data.paymentMethod as PaymentMethod,
      deliveryMethod: data.deliveryMethod as DeliveryMethod,
      subtotal,
      shippingCost,
      depositAmount,
      total,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      shippingAddress: data.shippingAddress,
      shippingCity: data.shippingCity,
      shippingProvince: data.shippingProvince,
      shippingCap: data.shippingCap,
      shippingNotes: data.shippingNotes,
      isPreorder,
      items: {
        create: data.items.map((i) => ({
          productId: i.productId,
          productName: i.name,
          productSlug: i.slug,
          price: i.price,
          quantity: i.quantity,
          isPreorder: i.isPreorder ?? false,
        })),
      },
    };

    const tx: any[] = [prisma.order.create({ data: createOrderData })];
    // decrement stock for non-preorder items
    for (const item of data.items) {
      const p = productById[item.productId];
      const isPre = item.isPreorder || p.allowPreorder || p.status === "PREORDER";
      if (!isPre && item.quantity > 0) {
        tx.push(
          prisma.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } })
        );
      }
    }

    const results = await prisma.$transaction(tx);
    const order = results[0];

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    await notifyAdmin("order", {
      title: `Nuovo ordine ${orderNumber}`,
      message: `${data.customerName} ha inviato un ordine da ${subtotal.toFixed(
        2
      )} euro. Metodo: ${data.paymentMethod}.`,
      url: `${siteUrl}/admin/orders`,
      metadata: {
        orderId: order.id,
        orderNumber,
        customerEmail: data.customerEmail,
        requiresQuote: data.requiresQuote,
      },
    });

    if (data.paymentMethod === "STRIPE_CARD" && !data.requiresQuote) {
      const lineItems = data.items.map((i) => ({
        price_data: {
          currency: "eur",
          product_data: { name: i.name },
          unit_amount: Math.round(i.price * 100),
        },
        quantity: i.quantity,
      }));

      if (shippingCost && shippingCost > 0) {
        lineItems.push({
          price_data: {
            currency: "eur",
            product_data: { name: "Spedizione" },
            unit_amount: Math.round(shippingCost * 100),
          },
          quantity: 1,
        });
      }

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: data.customerEmail,
        line_items: lineItems,
        success_url: `${siteUrl}/checkout/conferma?ordine=${orderNumber}`,
        cancel_url: `${siteUrl}/checkout`,
        metadata: { orderId: order.id, orderNumber },
      });

      await prisma.order.update({
        where: { id: order.id },
        data: { stripeSessionId: session.id },
      });

      return NextResponse.json({ orderNumber, checkoutUrl: session.url });
    }

    return NextResponse.json({ orderNumber, orderId: order.id });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Dati non validi" }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: "Errore server" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(orders);
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const patchSchema = z.object({
      id: z.string().min(1),
      status: z.nativeEnum(OrderStatus).optional(),
      paymentStatus: z.nativeEnum(PaymentStatus).optional(),
    });
    const { id, status, paymentStatus } = patchSchema.parse(await req.json());
    const order = await prisma.order.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
      },
    });

    return NextResponse.json(order);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Dati non validi" }, { status: 400 });
    }
    return NextResponse.json({ error: "Errore server" }, { status: 500 });
  }
}
