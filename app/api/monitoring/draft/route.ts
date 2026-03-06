import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      phone,
      country_code,
      country_iso,
      continents,
      adults,
      children,
      days,
      budget,
      airlines,
    } = body;

    if (!name || !phone || !budget || !Array.isArray(continents) || !Array.isArray(days)) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("monitoring_sessions")
      .insert({
        email: userEmail,
        user_email: userEmail,
        name: String(name).trim(),
        phone: String(phone).trim(),
        country_code: String(country_code ?? ""),
        country_iso: country_iso ?? null,
        continents: Array.isArray(continents) ? continents : [],
        adults: Number(adults) || 1,
        children: Number(children) || 0,
        days: Array.isArray(days) ? days : [],
        budget: String(budget).trim(),
        airlines: Array.isArray(airlines) ? airlines : [],
        status: "pending_payment",
        expires_at: null,
        stripe_session_id: null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error("Draft create error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create draft" },
      { status: 500 }
    );
  }
}
