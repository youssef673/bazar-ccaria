import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata = {
  title: "Checkout",
  description: "Completa il tuo ordine — bazar.ccaria",
};

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-display text-4xl text-charcoal mb-8">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
