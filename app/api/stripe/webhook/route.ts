import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status !== "paid") {
      return NextResponse.json({ ok: true, skipped: "not paid" });
    }

    // Extract monitoring_id from success_url query params
    const successUrl = session.success_url ?? "";
    const match = successUrl.match(/monitoring_id=([^&]+)/);
    const monitoringId = match ? decodeURIComponent(match[1]) : null;

    if (!monitoringId) {
      console.error("No monitoring_id found in success_url:", successUrl);
      return NextResponse.json({ error: "No monitoring_id in session" }, { status: 400 });
    }

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    const { data, error } = await supabase
      .from("monitoring_sessions")
      .update({
        status: "active",
        expires_at: expiresAt.toISOString(),
        stripe_session_id: session.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", monitoringId)
      .eq("status", "pending_payment")
      .select()
      .single();

    if (error) {
      console.error("Webhook activate error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      console.warn("Session not found or already activated:", monitoringId);
      return NextResponse.json({ ok: true, skipped: "already activated" });
    }

    console.log("✅ Session activated via webhook:", monitoringId);
  }

  return NextResponse.json({ ok: true });
}