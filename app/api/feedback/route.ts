import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, subject, description } = await request.json();
    if (!email || !subject || !description) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not set");
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "SOSAirways Feedback <feedback@whatareyouvibecoding.com>",
        to: "mustapha.maa@gmail.com",
        subject: `[SOSAirways Feedback] ${subject}`,
        text: `From: ${email}\n\nSubject: ${subject}\n\nDescription:\n${description}`,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Resend error:", data);
      return NextResponse.json({ error: data }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Feedback error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}