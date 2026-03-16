"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const C = {
  bg: "#FAF8F5",
  border: "#e8e3dc",
  text: "#1a1a1a",
  textMid: "#6b6b6b",
  accent: "#2D1B69",
  green: "#16a34a",
  error: "#dc2626",
};

function DohaSuccessContent() {
  const { status: sessionStatus } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // If session finished loading and user is not logged in, redirect to /?city=doha
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.replace("/?city=doha");
      return;
    }
  }, [sessionStatus, router]);

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (sessionStatus === "unauthenticated") return;

    const monitoringId = searchParams.get("monitoring_id");
    const sessionId = searchParams.get("session_id");
    if (!monitoringId) {
      setStatus("error");
      setErrorMessage("Missing session. Start again from the Doha form.");
      return;
    }
    setStatus("loading");
    fetch("/api/monitoring/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        monitoring_id: monitoringId,
        stripe_session_id: sessionId || undefined,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setStatus("error");
          setErrorMessage(data.error || "Activation failed");
          return;
        }
        setStatus("success");
      })
      .catch(() => {
        setStatus("error");
        setErrorMessage("Something went wrong.");
      });
  }, [searchParams, sessionStatus]);

  // Session loading: show spinner
  if (sessionStatus === "loading") {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
        <div style={{ width: "32px", height: "32px", border: "3px solid " + C.border, borderTopColor: C.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <span style={{ fontFamily: "ui-monospace, monospace", color: C.textMid, fontSize: "13px" }}>Loading…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // No session after load: redirect is triggered above; show spinner while redirecting
  if (sessionStatus === "unauthenticated") {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
        <div style={{ width: "32px", height: "32px", border: "3px solid " + C.border, borderTopColor: C.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <span style={{ fontFamily: "ui-monospace, monospace", color: C.textMid, fontSize: "13px" }}>Redirecting…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (status === "loading" || status === "idle") {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
        <div style={{ width: "32px", height: "32px", border: "3px solid " + C.border, borderTopColor: C.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <span style={{ fontFamily: "ui-monospace, monospace", color: C.textMid, fontSize: "13px" }}>Activating your monitoring…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Newsreader', serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ textAlign: "center", maxWidth: "420px" }}>
          <p style={{ color: C.error, marginBottom: "24px", fontFamily: "ui-monospace, monospace" }}>{errorMessage}</p>
          <Link href="/dashboard" style={{ display: "inline-block", padding: "10px 24px", borderRadius: "8px", border: `1px solid ${C.border}`, color: C.textMid, textDecoration: "none", fontFamily: "ui-monospace, monospace" }}>Go to Dashboard</Link>
        </div>
      </div>
    );
  }

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
          Payment confirmed. We&apos;re scanning all departures from Doha every 5 minutes. You&apos;ll receive WhatsApp alerts as soon as seats open up.
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
          To receive your first alert, send us a WhatsApp message at{" "}
          <a
            href="https://wa.me/14153902946"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: C.accent, textDecoration: "none", fontWeight: "500" }}
          >
            +1 (415) 390-2946
          </a>
          . We&apos;ll take it from there.
        </div>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/dashboard"
            style={{
              display: "inline-block",
              background: C.accent,
              border: `1px solid ${C.accent}`,
              color: "#fff",
              padding: "10px 24px",
              borderRadius: "8px",
              fontSize: "13px",
              fontFamily: "ui-monospace, monospace",
              textDecoration: "none",
            }}
          >
            View Dashboard
          </Link>
          <Link
            href="/"
            style={{
              display: "inline-block",
              background: "transparent",
              border: `1px solid ${C.border}`,
              color: C.textMid,
              padding: "10px 24px",
              borderRadius: "8px",
              fontSize: "13px",
              fontFamily: "ui-monospace, monospace",
              textDecoration: "none",
            }}
          >
            ← Back to home
          </Link>
        </div>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}

export default function DohaSuccessPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "ui-monospace, monospace", color: C.textMid }}>Loading…</div>}>
      <DohaSuccessContent />
    </Suspense>
  );
}
