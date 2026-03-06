import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const monitoringId = body.monitoring_id as string;
    const stripeSessionId = body.stripe_session_id as string | undefined;

    if (!monitoringId || !stripeSessionId) {
      return NextResponse.json({ error: "Missing monitoring_id or session_id" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    const { data, error } = await supabase
      .from("monitoring_sessions")
      .update({
        status: "active",
        expires_at: expiresAt.toISOString(),
        stripe_session_id: stripeSessionId ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", monitoringId)
      .eq("status", "pending_payment")
      .select()
      .single();

    if (error) {
      console.error("Activate update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Session not found or already activated" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, session: data });
  } catch (err) {
    console.error("Activate error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Activation failed" },
      { status: 500 }
    );
  }
}
