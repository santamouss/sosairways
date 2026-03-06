"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const C = {
  bg: "#FAF8F5",
  bgAlt: "#F3F0EB",
  text: "#1a1a1a",
  textMid: "#6b6b6b",
  textLight: "#a8a8a8",
  border: "#e8e3dc",
  accent: "#2D1B69",
  accentLight: "rgba(45,27,105,0.08)",
  accentMid: "rgba(45,27,105,0.15)",
  green: "#16a34a",
  error: "#dc2626",
};

const CONTINENTS: { id: string; label: string; emoji: string }[] = [
  { id: "europe", label: "Europe", emoji: "🇪🇺" },
  { id: "asia", label: "Asia Pacific", emoji: "🌏" },
  { id: "africa", label: "Africa", emoji: "🌍" },
  { id: "americas", label: "Americas", emoji: "🌎" },
  { id: "any", label: "Anywhere", emoji: "🌐" },
];

const COUNTRY_CODES = [
  { name: "United Arab Emirates", code: "+971", flag: "🇦🇪", iso: "AE" },
  { name: "United States", code: "+1", flag: "🇺🇸", iso: "US" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧", iso: "GB" },
  { name: "Saudi Arabia", code: "+966", flag: "🇸🇦", iso: "SA" },
  { name: "Lebanon", code: "+961", flag: "🇱🇧", iso: "LB" },
  { name: "Jordan", code: "+962", flag: "🇯🇴", iso: "JO" },
  { name: "Qatar", code: "+974", flag: "🇶🇦", iso: "QA" },
  { name: "Kuwait", code: "+965", flag: "🇰🇼", iso: "KW" },
  { name: "Egypt", code: "+20", flag: "🇪🇬", iso: "EG" },
  { name: "India", code: "+91", flag: "🇮🇳", iso: "IN" },
  { name: "Pakistan", code: "+92", flag: "🇵🇰", iso: "PK" },
  { name: "Canada", code: "+1", flag: "🇨🇦", iso: "CA" },
  { name: "Australia", code: "+61", flag: "🇦🇺", iso: "AU" },
  { name: "Turkey", code: "+90", flag: "🇹🇷", iso: "TR" },
];

const AIRLINES = [
  "Emirates", "Etihad Airways", "flydubai", "Air Arabia",
  "British Airways", "Lufthansa", "Air France", "KLM",
  "Turkish Airlines", "Qatar Airways", "Gulf Air", "Oman Air",
  "Singapore Airlines", "Thai Airways", "Cathay Pacific",
  "Kenya Airways", "EgyptAir", "Royal Jordanian",
];

type Session = {
  id: string;
  name: string;
  phone: string;
  country_code: string;
  country_iso: string | null;
  continents: string[];
  adults: number;
  children: number;
  days: string[];
  budget: string;
  airlines: string[];
  status: string;
  expires_at: string | null;
};

function formatTimeRemaining(expiresAt: string): string {
  const end = new Date(expiresAt).getTime();
  const now = Date.now();
  const ms = end - now;
  if (ms <= 0) return "Expired";
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}m remaining`;
  return `${minutes}m remaining`;
}

export default function DashboardPage() {
  const { data: session, status: authStatus } = useSession();
  const [active, setActive] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Session>>({});

  useEffect(() => {
    if (authStatus === "unauthenticated") return;
    if (authStatus !== "authenticated") return;
    fetch("/api/monitoring/active")
      .then((res) => res.json())
      .then((data) => {
        if (data.session) {
          setActive(data.session);
          setForm(data.session);
        } else {
          setActive(null);
        }
      })
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, [authStatus]);

  const handleSave = async () => {
    if (!active) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/monitoring/${active.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          country_code: form.country_code,
          country_iso: form.country_iso,
          continents: form.continents,
          adults: form.adults,
          children: form.children,
          days: form.days,
          budget: form.budget,
          airlines: form.airlines,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setActive(data.session);
      setForm(data.session);
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelMonitoring = async () => {
    if (!active) return;
    if (!confirm("Cancel your active monitoring? You will need to pay again to restart.")) return;
    setCancelLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/monitoring/${active.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Cancel failed");
      }
      setActive(null);
      setForm({});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Cancel failed");
    } finally {
      setCancelLoading(false);
    }
  };

  if (authStatus === "loading" || authStatus === "unauthenticated") {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Newsreader', serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ textAlign: "center" }}>
          {authStatus === "unauthenticated" ? (
            <>
              <p style={{ color: C.textMid, marginBottom: "16px", fontFamily: "ui-monospace, monospace" }}>Sign in to view your dashboard.</p>
              <Link href="/" style={{ color: C.accent, fontFamily: "ui-monospace, monospace" }}>Go to home</Link>
            </>
          ) : (
            <p style={{ color: C.textMid, fontFamily: "ui-monospace, monospace" }}>Loading…</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Newsreader', serif", color: C.text }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 48px", borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        <Link href="/" style={{ color: C.textMid, fontSize: "13px", fontFamily: "ui-monospace, monospace", textDecoration: "none" }}>← SOSAirways</Link>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {session?.user?.email && <span style={{ fontSize: "12px", fontFamily: "ui-monospace, monospace", color: C.textMid }}>{session.user.email}</span>}
        </div>
      </nav>

      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "48px 32px 80px" }}>
        <h1 style={{ fontSize: "clamp(32px, 4vw, 44px)", fontWeight: "400", letterSpacing: "-0.02em", marginBottom: "8px", color: C.text }}>
          Dashboard
        </h1>
        <p style={{ fontSize: "14px", color: C.textMid, fontFamily: "ui-monospace, monospace", marginBottom: "40px" }}>
          Your flight monitoring session
        </p>

        {loading && (
          <p style={{ color: C.textMid, fontFamily: "ui-monospace, monospace" }}>Loading…</p>
        )}

        {error && (
          <div style={{ marginBottom: "24px", padding: "12px 16px", background: "rgba(220,38,38,0.08)", border: `1px solid ${C.error}`, borderRadius: "8px", fontSize: "13px", color: C.error, fontFamily: "ui-monospace, monospace" }}>
            {error}
          </div>
        )}

        {!loading && !active && (
          <div style={{ padding: "32px", background: "#fff", border: `1px solid ${C.border}`, borderRadius: "12px", textAlign: "center" }}>
            <p style={{ fontSize: "16px", color: C.textMid, marginBottom: "24px", fontFamily: "ui-monospace, monospace" }}>No active monitoring</p>
            <p style={{ fontSize: "13px", color: C.textLight, marginBottom: "24px", fontFamily: "ui-monospace, monospace" }}>Set up Dubai monitoring and complete payment to start.</p>
            <Link href="/" style={{ display: "inline-block", padding: "12px 24px", borderRadius: "10px", background: C.accent, color: "#fff", fontSize: "14px", fontFamily: "ui-monospace, monospace", textDecoration: "none" }}>Start monitoring</Link>
          </div>
        )}

        {!loading && active && !editing && (
          <>
            <div style={{ padding: "24px", background: "#fff", border: `1px solid ${C.border}`, borderRadius: "12px", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: C.green }} />
                <span style={{ fontSize: "12px", fontFamily: "ui-monospace, monospace", color: C.green, letterSpacing: "0.05em" }}>ACTIVE</span>
              </div>
              <p style={{ fontSize: "13px", color: C.textMid, fontFamily: "ui-monospace, monospace", marginBottom: "16px" }}>
                Time remaining: <strong style={{ color: C.text }}>{active.expires_at ? formatTimeRemaining(active.expires_at) : "—"}</strong>
              </p>
              <div style={{ fontSize: "13px", color: C.textMid, fontFamily: "ui-monospace, monospace", lineHeight: "1.8" }}>
                <p><strong style={{ color: C.text }}>Name:</strong> {active.name}</p>
                <p><strong style={{ color: C.text }}>WhatsApp:</strong> {active.country_code} {active.phone}</p>
                <p><strong style={{ color: C.text }}>Destinations:</strong> {(active.continents || []).map((id) => CONTINENTS.find((c) => c.id === id)?.label ?? id).join(", ") || "—"}</p>
                <p><strong style={{ color: C.text }}>Passengers:</strong> {active.adults} adult(s), {active.children} child(ren)</p>
                <p><strong style={{ color: C.text }}>Travel days:</strong> {(active.days || []).map((d) => d === "0" ? "Today" : d === "1" ? "Tomorrow" : "Day after").join(", ") || "—"}</p>
                <p><strong style={{ color: C.text }}>Budget:</strong> ${Number(active.budget || 0).toLocaleString()} USD per ticket</p>
                <p><strong style={{ color: C.text }}>Airlines:</strong> {(active.airlines || []).length ? (active.airlines || []).join(", ") : "Any"}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button onClick={() => setEditing(true)} style={{ padding: "10px 20px", borderRadius: "8px", border: `1px solid ${C.accent}`, background: "#fff", color: C.accent, fontSize: "13px", fontFamily: "ui-monospace, monospace", cursor: "pointer" }}>Edit</button>
              <button onClick={handleCancelMonitoring} disabled={cancelLoading} style={{ padding: "10px 20px", borderRadius: "8px", border: `1px solid ${C.border}`, background: "#fff", color: C.textMid, fontSize: "13px", fontFamily: "ui-monospace, monospace", cursor: cancelLoading ? "wait" : "pointer" }}>{cancelLoading ? "Cancelling…" : "Cancel Monitoring"}</button>
            </div>
          </>
        )}

        {!loading && active && editing && (
          <div style={{ padding: "24px", background: "#fff", border: `1px solid ${C.border}`, borderRadius: "12px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "500", marginBottom: "20px", color: C.text }}>Edit preferences</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "11px", fontFamily: "ui-monospace, monospace", color: C.textMid, letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}>NAME</label>
                <input value={form.name ?? ""} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: `1px solid ${C.border}`, fontSize: "14px", fontFamily: "ui-monospace, monospace" }} />
              </div>
              <div>
                <label style={{ fontSize: "11px", fontFamily: "ui-monospace, monospace", color: C.textMid, letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}>PHONE</label>
                <input value={form.phone ?? ""} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: `1px solid ${C.border}`, fontSize: "14px", fontFamily: "ui-monospace, monospace" }} />
              </div>
              <div>
                <label style={{ fontSize: "11px", fontFamily: "ui-monospace, monospace", color: C.textMid, letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}>COUNTRY CODE</label>
                <select value={form.country_code ?? ""} onChange={(e) => { const c = COUNTRY_CODES.find((x) => x.code === e.target.value); if (c) setForm((f) => ({ ...f, country_code: c.code, country_iso: c.iso })); }} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: `1px solid ${C.border}`, fontSize: "14px", fontFamily: "ui-monospace, monospace" }}>
                  {COUNTRY_CODES.map((c) => <option key={c.iso + c.code} value={c.code}>{c.flag} {c.code} {c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: "11px", fontFamily: "ui-monospace, monospace", color: C.textMid, letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}>DESTINATIONS</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {CONTINENTS.map((c) => (
                    <button key={c.id} type="button" onClick={() => setForm((f) => ({ ...f, continents: (f.continents || []).includes(c.id) ? (f.continents || []).filter((x) => x !== c.id) : c.id === "any" ? ["any"] : [...(f.continents || []).filter((x) => x !== "any"), c.id] }))} style={{ padding: "6px 12px", borderRadius: "6px", border: `1px solid ${(form.continents || []).includes(c.id) ? C.accent : C.border}`, background: (form.continents || []).includes(c.id) ? C.accentLight : "#fff", color: (form.continents || []).includes(c.id) ? C.accent : C.textMid, fontSize: "12px", fontFamily: "ui-monospace, monospace", cursor: "pointer" }}>{c.emoji} {c.label}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: "24px" }}>
                <div>
                  <label style={{ fontSize: "11px", fontFamily: "ui-monospace, monospace", color: C.textMid, letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}>ADULTS</label>
                  <input type="number" min={1} max={9} value={form.adults ?? 1} onChange={(e) => setForm((f) => ({ ...f, adults: parseInt(e.target.value, 10) || 1 }))} style={{ width: "80px", padding: "10px 12px", borderRadius: "8px", border: `1px solid ${C.border}`, fontSize: "14px", fontFamily: "ui-monospace, monospace" }} />
                </div>
                <div>
                  <label style={{ fontSize: "11px", fontFamily: "ui-monospace, monospace", color: C.textMid, letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}>CHILDREN</label>
                  <input type="number" min={0} max={9} value={form.children ?? 0} onChange={(e) => setForm((f) => ({ ...f, children: parseInt(e.target.value, 10) || 0 }))} style={{ width: "80px", padding: "10px 12px", borderRadius: "8px", border: `1px solid ${C.border}`, fontSize: "14px", fontFamily: "ui-monospace, monospace" }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "11px", fontFamily: "ui-monospace, monospace", color: C.textMid, letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}>TRAVEL DAYS</label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {["0", "1", "2"].map((d) => (
                    <button key={d} type="button" onClick={() => setForm((f) => ({ ...f, days: (f.days || []).includes(d) ? (f.days || []).filter((x) => x !== d) : [...(f.days || []), d] }))} style={{ padding: "6px 12px", borderRadius: "6px", border: `1px solid ${(form.days || []).includes(d) ? C.accent : C.border}`, background: (form.days || []).includes(d) ? C.accentLight : "#fff", color: (form.days || []).includes(d) ? C.accent : C.textMid, fontSize: "12px", fontFamily: "ui-monospace, monospace", cursor: "pointer" }}>{d === "0" ? "Today" : d === "1" ? "Tomorrow" : "Day after"}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: "11px", fontFamily: "ui-monospace, monospace", color: C.textMid, letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}>BUDGET (USD)</label>
                <input type="number" min={0} value={form.budget ?? ""} onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: `1px solid ${C.border}`, fontSize: "14px", fontFamily: "ui-monospace, monospace" }} />
              </div>
              <div>
                <label style={{ fontSize: "11px", fontFamily: "ui-monospace, monospace", color: C.textMid, letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}>AIRLINES (comma-separated)</label>
                <input value={(form.airlines || []).join(", ")} onChange={(e) => setForm((f) => ({ ...f, airlines: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))} placeholder="Emirates, Etihad, ..." style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: `1px solid ${C.border}`, fontSize: "14px", fontFamily: "ui-monospace, monospace" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button onClick={handleSave} disabled={saving} style={{ padding: "10px 20px", borderRadius: "8px", border: "none", background: C.accent, color: "#fff", fontSize: "13px", fontFamily: "ui-monospace, monospace", cursor: saving ? "wait" : "pointer" }}>{saving ? "Saving…" : "Save changes"}</button>
              <button onClick={() => { setEditing(false); setForm(active); }} style={{ padding: "10px 20px", borderRadius: "8px", border: `1px solid ${C.border}`, background: "#fff", color: C.textMid, fontSize: "13px", fontFamily: "ui-monospace, monospace", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
