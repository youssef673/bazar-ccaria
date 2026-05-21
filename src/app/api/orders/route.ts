import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { generateOrderNumber } from "@/lib/utils";
import { validateCalabriaDelivery } from "@/lib/calabria";
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

    const orderNumber = generateOrderNumber();
    const status = data.requiresQuote ? "QUOTE_REQUESTED" : "PENDING";

    const order = await prisma.order.create({
      data: {
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
      },
    });

    if (data.paymentMethod === "STRIPE_CARD" && !data.requiresQuote) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
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
