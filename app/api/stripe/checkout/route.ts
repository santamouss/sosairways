import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const origin = (body.origin as string) || request.headers.get("origin") || "http://localhost:3000";
    const successUrl = `${origin}/dubai/success`;
    const cancelUrl = `${origin}/dubai`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: 2000, // $20.00
            product_data: {
              name: "Dubai flight monitoring (48 hours)",
              description: "Real-time flight monitoring from Dubai with WhatsApp alerts",
            },
          },
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    if (!session.url) {
      return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
