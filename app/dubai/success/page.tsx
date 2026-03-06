"use client";

import Link from "next/link";

const C = {
  bg: "#FAF8F5",
  border: "#e8e3dc",
  text: "#1a1a1a",
  textMid: "#6b6b6b",
  accent: "#2D1B69",
  green: "#16a34a",
};

export default function DubaiSuccessPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        fontFamily: "'Newsreader', Georgia, serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        color: C.text,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "420px" }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "rgba(22,163,74,0.1)",
            border: "1px solid rgba(22,163,74,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "26px",
            margin: "0 auto 32px",
            color: C.green,
          }}
        >
          ✓
        </div>
        <h1
          style={{
            fontSize: "36px",
            fontWeight: "400",
            letterSpacing: "-0.02em",
            marginBottom: "16px",
            color: C.text,
          }}
        >
          Monitoring <em style={{ color: C.accent }}>activated.</em>
        </h1>
        <p
          style={{
            color: C.textMid,
            lineHeight: "1.8",
            fontSize: "14px",
            marginBottom: "32px",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          Payment confirmed. We&apos;re scanning all departures from Dubai every 5 minutes. You&apos;ll receive WhatsApp alerts as soon as seats open up.
        </p>
        <div
          style={{
            padding: "18px 24px",
            borderRadius: "12px",
            border: `1px solid ${C.border}`,
            background: "#fff",
            fontSize: "13px",
            color: C.textMid,
            lineHeight: "1.8",
            fontFamily: "ui-monospace, monospace",
            marginBottom: "32px",
          }}
        >
          Active for <span style={{ color: C.text, fontWeight: "500" }}>48 hours</span> · Reply{" "}
          <span style={{ color: C.text, fontWeight: "500" }}>STOP</span> to cancel anytime
        </div>
        <Link
          href="/"
          style={{
            display: "inline-block",
            background: "transparent",
            border: `1px solid ${C.border}`,
            color: C.textMid,
            padding: "10px 24px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "13px",
            fontFamily: "ui-monospace, monospace",
            textDecoration: "none",
          }}
        >
          ← Back to home
        </Link>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
