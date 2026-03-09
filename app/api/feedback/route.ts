import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, subject, description } = await request.json();
  if (!email || !subject || !description) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "feedback@sosairways.com",
      to: "mustapha.maa@gmail.com",
      subject: `[SOSAirways Feedback] ${subject}`,
      text: `From: ${email}\n\nSubject: ${subject}\n\nDescription:\n${description}`,
    }),
  });

  if (!res.ok) return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
