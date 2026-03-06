import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const { data, error } = await supabase
    .from("monitoring_sessions")
    .select("*")
    .eq("id", id)
    .eq("email", session.user.email)
    .single();
  if (error || !data) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }
  return NextResponse.json(data);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  // If cancelling
  if (body.status === "cancelled") {
    const { data, error } = await supabase
      .from("monitoring_sessions")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("email", session.user.email)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    return NextResponse.json({ session: data });
  }

  // Update preferences
  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (body.name !== undefined) updates.name = String(body.name).trim();
  if (body.phone !== undefined) updates.phone = String(body.phone).trim();
  if (body.country_code !== undefined) updates.country_code = body.country_code;
  if (body.country_iso !== undefined) updates.country_iso = body.country_iso;
  if (body.continents !== undefined) updates.continents = body.continents;
  if (body.adults !== undefined) updates.adults = Number(body.adults) || 1;
  if (body.children !== undefined) updates.children = Number(body.children) || 0;
  if (body.days !== undefined) updates.days = body.days;
  if (body.budget !== undefined) updates.budget = String(body.budget).trim();
  if (body.airlines !== undefined) updates.airlines = body.airlines;

  const { data, error } = await supabase
    .from("monitoring_sessions")
    .update(updates)
    .eq("id", id)
    .eq("email", session.user.email)
    .eq("status", "active")
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }
  return NextResponse.json({ session: data });
}
