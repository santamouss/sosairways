"use client";

import { useState, useRef, useEffect } from "react";

const CITIES = [
  { code: "dubai", name: "Dubai", airport: "DXB", country: "UAE", active: true, flag: "🇦🇪" },
  { code: "riyadh", name: "Riyadh", airport: "RUH", country: "Saudi Arabia", active: false, flag: "🇸🇦" },
  { code: "beirut", name: "Beirut", airport: "BEY", country: "Lebanon", active: false, flag: "🇱🇧" },
  { code: "doha", name: "Doha", airport: "DOH", country: "Qatar", active: false, flag: "🇶🇦" },
  { code: "kuwait", name: "Kuwait City", airport: "KWI", country: "Kuwait", active: false, flag: "🇰🇼" },
  { code: "amman", name: "Amman", airport: "AMM", country: "Jordan", active: false, flag: "🇯🇴" },
];

const CONTINENTS = [
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
  { name: "Bahrain", code: "+973", flag: "🇧🇭", iso: "BH" },
  { name: "Oman", code: "+968", flag: "🇴🇲", iso: "OM" },
  { name: "Egypt", code: "+20", flag: "🇪🇬", iso: "EG" },
  { name: "France", code: "+33", flag: "🇫🇷", iso: "FR" },
  { name: "Germany", code: "+49", flag: "🇩🇪", iso: "DE" },
  { name: "India", code: "+91", flag: "🇮🇳", iso: "IN" },
  { name: "Pakistan", code: "+92", flag: "🇵🇰", iso: "PK" },
  { name: "Philippines", code: "+63", flag: "🇵🇭", iso: "PH" },
  { name: "Canada", code: "+1", flag: "🇨🇦", iso: "CA" },
  { name: "Australia", code: "+61", flag: "🇦🇺", iso: "AU" },
  { name: "Turkey", code: "+90", flag: "🇹🇷", iso: "TR" },
  { name: "Kenya", code: "+254", flag: "🇰🇪", iso: "KE" },
  { name: "Nigeria", code: "+234", flag: "🇳🇬", iso: "NG" },
  { name: "South Africa", code: "+27", flag: "🇿🇦", iso: "ZA" },
  { name: "Morocco", code: "+212", flag: "🇲🇦", iso: "MA" },
  { name: "Thailand", code: "+66", flag: "🇹🇭", iso: "TH" },
  { name: "Singapore", code: "+65", flag: "🇸🇬", iso: "SG" },
  { name: "Japan", code: "+81", flag: "🇯🇵", iso: "JP" },
  { name: "Brazil", code: "+55", flag: "🇧🇷", iso: "BR" },
  { name: "Netherlands", code: "+31", flag: "🇳🇱", iso: "NL" },
  { name: "Spain", code: "+34", flag: "🇪🇸", iso: "ES" },
  { name: "Italy", code: "+39", flag: "🇮🇹", iso: "IT" },
];

const AIRLINES = [
  "Emirates", "Etihad Airways", "flydubai", "Air Arabia",
  "British Airways", "Lufthansa", "Air France", "KLM",
  "Turkish Airlines", "Qatar Airways", "Gulf Air", "Oman Air",
  "Singapore Airlines", "Thai Airways", "Cathay Pacific",
  "Kenya Airways", "EgyptAir", "Royal Jordanian",
  "Swiss International", "Austrian Airlines", "Finnair",
  "ITA Airways", "Wizz Air Abu Dhabi", "Air India",
];

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

// ── Reusable input style ──
const inputStyle = (focused: boolean, error: boolean) => ({
  background: "#fff",
  border: `1px solid ${error ? C.error : focused ? C.accent : C.border}`,
  borderRadius: "8px", padding: "13px 16px",
  fontSize: "14px", color: C.text,
  fontFamily: "ui-monospace, monospace",
  width: "100%", outline: "none",
  boxShadow: focused ? `0 0 0 3px ${error ? "rgba(220,38,38,0.1)" : C.accentLight}` : "0 1px 3px rgba(0,0,0,0.04)",
  transition: "all 0.15s",
});

// ── Landing Page ──────────────────────────────────────────────
function LandingPage({ onSelectCity }: { onSelectCity: (code: string) => void }) {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Newsreader', Georgia, serif", color: C.text }}>
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 48px", borderBottom: `1px solid ${C.border}`,
        background: C.bg, position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "30px", height: "30px", borderRadius: "8px",
            background: C.accent, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "14px", color: "#fff",
          }}>✈</div>
          <span style={{ fontSize: "16px", fontWeight: "600", color: C.text, letterSpacing: "-0.01em", fontFamily: "'Newsreader', serif" }}>SOSAirways</span>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: "7px",
          fontSize: "12px", fontFamily: "ui-monospace, monospace",
          color: C.green, letterSpacing: "0.05em",
          background: "rgba(22,163,74,0.08)", padding: "6px 12px",
          borderRadius: "100px", border: "1px solid rgba(22,163,74,0.2)",
        }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.green, animation: "blink 2s infinite" }} />
          LIVE MONITORING
        </div>
      </nav>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "88px 48px 72px", textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          fontSize: "12px", fontFamily: "ui-monospace, monospace",
          letterSpacing: "0.08em", color: C.accent,
          background: C.accentLight, border: `1px solid ${C.accentMid}`,
          padding: "7px 16px", borderRadius: "100px", marginBottom: "40px",
        }}>
          Emergency Evacuation Flight Service
        </div>

        <h1 style={{ fontSize: "clamp(48px, 7vw, 88px)", lineHeight: "1.04", fontWeight: "400", letterSpacing: "-0.03em", margin: "0 0 28px", color: C.text }}>
          We find the flights.<br />
          <span style={{ color: C.accent, fontStyle: "italic" }}>You focus on what matters.</span>
        </h1>

        <p style={{ fontSize: "15px", lineHeight: "1.8", color: C.textMid, maxWidth: "520px", margin: "0 auto 56px", fontFamily: "ui-monospace, monospace" }}>
          Real-time flight monitoring during crises. We scan every departure every 5 minutes
          and send you a WhatsApp alert the moment seats open up.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "48px", marginBottom: "64px", paddingBottom: "48px", borderBottom: `1px solid ${C.border}` }}>
          {[{ val: "48+", label: "Flights monitored" }, { val: "5 min", label: "Scan interval" }, { val: "3 days", label: "Forward coverage" }].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "28px", fontWeight: "500", color: C.text, letterSpacing: "-0.02em" }}>{s.val}</div>
              <div style={{ fontSize: "12px", color: C.textLight, fontFamily: "ui-monospace, monospace", marginTop: "4px", letterSpacing: "0.05em" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: "11px", fontFamily: "ui-monospace, monospace", color: C.textLight, letterSpacing: "0.15em", marginBottom: "16px" }}>
          SELECT YOUR CITY TO GET STARTED
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(256px, 1fr))", gap: "10px", maxWidth: "800px", margin: "0 auto 96px", textAlign: "left" }}>
          {CITIES.map(city => (
            <button key={city.code} onClick={() => city.active && onSelectCity(city.code)} style={{
              background: city.active ? "#fff" : C.bgAlt,
              border: `1px solid ${city.active ? C.border : "transparent"}`,
              borderRadius: "12px", padding: "18px 20px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              cursor: city.active ? "pointer" : "not-allowed", transition: "all 0.18s",
              boxShadow: city.active ? "0 1px 4px rgba(0,0,0,0.04)" : "none",
            }}
              onMouseEnter={e => { if (city.active) { e.currentTarget.style.boxShadow = "0 4px 16px rgba(45,27,105,0.12)"; e.currentTarget.style.borderColor = C.accentMid; e.currentTarget.style.transform = "translateY(-1px)"; } }}
              onMouseLeave={e => { if (city.active) { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; } }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "24px" }}>{city.flag}</span>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: "500", color: city.active ? C.text : C.textLight, letterSpacing: "-0.01em", marginBottom: "2px" }}>{city.name}</div>
                  <div style={{ fontSize: "11px", fontFamily: "ui-monospace, monospace", color: city.active ? C.textMid : C.textLight, letterSpacing: "0.04em" }}>{city.airport} · {city.country}</div>
                </div>
              </div>
              <div style={{
                fontSize: "10px", fontFamily: "ui-monospace, monospace", letterSpacing: "0.08em",
                color: city.active ? C.green : C.textLight,
                background: city.active ? "rgba(22,163,74,0.08)" : C.bgAlt,
                border: `1px solid ${city.active ? "rgba(22,163,74,0.2)" : "transparent"}`,
                padding: "4px 10px", borderRadius: "100px",
                display: "flex", alignItems: "center", gap: "5px",
              }}>
                {city.active && <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: C.green }} />}
                {city.active ? "ACTIVE" : "SOON"}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: C.bgAlt, borderTop: `1px solid ${C.border}`, padding: "80px 48px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: "400", letterSpacing: "-0.02em", marginBottom: "56px", color: C.text, textAlign: "center" }}>
            How it <em style={{ color: C.accent }}>works</em>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px" }}>
            {[
              { n: "01", title: "Select your city", desc: "Tell us where you are departing from." },
              { n: "02", title: "Set your preferences", desc: "Choose destinations, passengers, and travel dates." },
              { n: "03", title: "We scan continuously", desc: "Every flight, every 5 minutes, day and night." },
              { n: "04", title: "You get alerted", desc: "WhatsApp with a direct booking link the moment seats open." },
            ].map(s => (
              <div key={s.n} style={{ padding: "24px", background: "#fff", borderRadius: "12px", border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: "11px", fontFamily: "ui-monospace, monospace", color: C.accent, letterSpacing: "0.1em", marginBottom: "14px", background: C.accentLight, display: "inline-block", padding: "4px 10px", borderRadius: "100px" }}>{s.n}</div>
                <div style={{ fontSize: "17px", color: C.text, marginBottom: "10px", letterSpacing: "-0.01em" }}>{s.title}</div>
                <div style={{ fontSize: "13px", color: C.textMid, lineHeight: "1.7", fontFamily: "ui-monospace, monospace" }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${C.border}`, padding: "24px 48px", display: "flex", justifyContent: "space-between", background: C.bg }}>
        <div style={{ fontSize: "12px", color: C.textLight, fontFamily: "ui-monospace, monospace" }}>© 2026 SOSAirways</div>
        <div style={{ fontSize: "12px", color: C.textLight, fontFamily: "ui-monospace, monospace", display: "flex", gap: "24px" }}>
          <span style={{ cursor: "pointer" }}>Privacy</span>
          <span style={{ cursor: "pointer" }}>Terms</span>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.4} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { font-family: inherit; }
      `}</style>
    </div>
  );
}

// ── Auth Page ─────────────────────────────────────────────────
function AuthPage({ onAuth, onBack }: { onAuth: (user: { email: string }) => void; onBack: () => void }) {
  const [mode, setMode] = useState("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!email || !password) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onAuth({ email }); }, 1500);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Newsreader', serif", color: C.text }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 48px", borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        <button onClick={onBack} style={{ background: "transparent", border: "none", color: C.textMid, cursor: "pointer", fontSize: "13px", fontFamily: "ui-monospace, monospace" }}>← SOSAirways</button>
        <div style={{ fontSize: "12px", fontFamily: "ui-monospace, monospace", color: C.textMid, border: `1px solid ${C.border}`, padding: "6px 14px", borderRadius: "100px", display: "flex", alignItems: "center", gap: "8px", background: "#fff" }}>
          <span>🇦🇪</span> Dubai · DXB
        </div>
      </nav>

      <div style={{ maxWidth: "440px", margin: "80px auto", padding: "0 32px" }}>
        <h1 style={{ fontSize: "40px", fontWeight: "400", letterSpacing: "-0.02em", marginBottom: "8px", color: C.text }}>
          {mode === "signup" ? "Create your account." : "Welcome back."}
        </h1>
        <p style={{ fontSize: "14px", color: C.textMid, fontFamily: "ui-monospace, monospace", marginBottom: "40px", lineHeight: "1.6" }}>
          {mode === "signup" ? "Save your preferences and manage your alerts." : "Sign in to continue monitoring."}
        </p>

        <div style={{ display: "flex", background: C.bgAlt, borderRadius: "10px", padding: "4px", marginBottom: "32px", border: `1px solid ${C.border}` }}>
          {["signup", "login"].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: "9px", borderRadius: "7px", border: "none", cursor: "pointer",
              background: mode === m ? "#fff" : "transparent",
              color: mode === m ? C.text : C.textMid,
              fontSize: "13px", fontFamily: "ui-monospace, monospace",
              boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.15s",
            }}>{m === "signup" ? "Sign up" : "Log in"}</button>
          ))}
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "12px", fontFamily: "ui-monospace, monospace", color: C.textMid, letterSpacing: "0.05em", display: "block", marginBottom: "8px" }}>EMAIL</label>
          <input
            type="email" placeholder="you@example.com" value={email}
            onChange={e => setEmail(e.target.value)}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            style={inputStyle(focusedField === "email", false)}
          />
        </div>

        <div style={{ marginBottom: "32px" }}>
          <label style={{ fontSize: "12px", fontFamily: "ui-monospace, monospace", color: C.textMid, letterSpacing: "0.05em", display: "block", marginBottom: "8px" }}>PASSWORD</label>
          <input
            type="password" placeholder="••••••••" value={password}
            onChange={e => setPassword(e.target.value)}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
            style={inputStyle(focusedField === "password", false)}
          />
        </div>

        <button onClick={handleSubmit} disabled={!email || !password || loading} style={{
          width: "100%", padding: "15px", borderRadius: "10px",
          background: email && password ? C.accent : C.bgAlt,
          border: `1px solid ${email && password ? C.accent : C.border}`,
          cursor: email && password ? "pointer" : "not-allowed",
          color: email && password ? "#fff" : C.textLight,
          fontSize: "14px", fontFamily: "ui-monospace, monospace",
          letterSpacing: "0.03em", transition: "all 0.2s",
          boxShadow: email && password ? "0 4px 16px rgba(45,27,105,0.25)" : "none",
        }}>
          {loading ? "..." : mode === "signup" ? "Create account →" : "Sign in →"}
        </button>

        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "12px", color: C.textLight, fontFamily: "ui-monospace, monospace" }}>
          {mode === "signup" ? "Already have an account? " : "Don't have an account? "}
          <span onClick={() => setMode(mode === "signup" ? "login" : "signup")} style={{ color: C.accent, cursor: "pointer" }}>
            {mode === "signup" ? "Log in" : "Sign up"}
          </span>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: #c8c4bc; }
      `}</style>
    </div>
  );
}

// ── Country Code Picker ───────────────────────────────────────
function CountryCodePicker({ value, onChange }: { value: (typeof COUNTRY_CODES)[0]; onChange: (c: (typeof COUNTRY_CODES)[0]) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filtered = COUNTRY_CODES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.includes(search)
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{
        display: "flex", alignItems: "center", gap: "6px",
        padding: "13px 12px", borderRadius: "8px 0 0 8px",
        background: "#fff", border: `1px solid ${C.border}`,
        borderRight: "none", cursor: "pointer", whiteSpace: "nowrap",
        fontSize: "14px", fontFamily: "ui-monospace, monospace", color: C.text,
        minWidth: "100px",
      }}>
        <span style={{ fontSize: "16px" }}>{value.flag}</span>
        <span>{value.code}</span>
        <span style={{ color: C.textLight, fontSize: "10px" }}>▾</span>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 100,
          background: "#fff", border: `1px solid ${C.border}`,
          borderRadius: "10px", width: "280px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          overflow: "hidden",
        }}>
          <div style={{ padding: "10px" }}>
            <input
              autoFocus
              placeholder="Search country..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%", padding: "9px 12px", borderRadius: "6px",
                border: `1px solid ${C.border}`, fontSize: "13px",
                fontFamily: "ui-monospace, monospace", outline: "none",
                background: C.bgAlt, color: C.text,
              }}
            />
          </div>
          <div style={{ maxHeight: "220px", overflowY: "auto" }}>
            {filtered.map(c => (
              <button key={c.iso + c.code} onClick={() => { onChange(c); setOpen(false); setSearch(""); }} style={{
                width: "100%", display: "flex", alignItems: "center", gap: "10px",
                padding: "10px 14px", background: "transparent", border: "none",
                cursor: "pointer", fontSize: "13px", fontFamily: "ui-monospace, monospace",
                color: C.text, textAlign: "left", transition: "background 0.1s",
              }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = C.bgAlt}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "transparent"}
              >
                <span style={{ fontSize: "18px" }}>{c.flag}</span>
                <span style={{ flex: 1 }}>{c.name}</span>
                <span style={{ color: C.textMid }}>{c.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Airline Multi-Select ──────────────────────────────────────
function AirlineSelector({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = AIRLINES.filter(a =>
    a.toLowerCase().includes(search.toLowerCase()) && !value.includes(a)
  ).slice(0, 6);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const remove = (airline: string) => onChange(value.filter(a => a !== airline));
  const add = (airline: string) => { onChange([...value, airline]); setSearch(""); setOpen(false); };

  return (
    <div ref={ref}>
      {value.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
          {value.map(a => (
            <div key={a} style={{
              display: "flex", alignItems: "center", gap: "6px",
              background: C.accentLight, border: `1px solid ${C.accentMid}`,
              borderRadius: "100px", padding: "5px 10px 5px 12px",
              fontSize: "12px", fontFamily: "ui-monospace, monospace", color: C.accent,
            }}>
              {a}
              <button onClick={() => remove(a)} style={{
                background: "none", border: "none", cursor: "pointer",
                color: C.accent, fontSize: "14px", lineHeight: 1, padding: 0,
              }}>×</button>
            </div>
          ))}
        </div>
      )}
      <div style={{ position: "relative" }}>
        <input
          placeholder="Search airlines... (optional)"
          value={search}
          onChange={e => { setSearch(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          style={{
            ...inputStyle(open, false),
            width: "100%",
          }}
        />
        {open && filtered.length > 0 && (
          <div style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100,
            background: "#fff", border: `1px solid ${C.border}`,
            borderRadius: "10px", boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
            overflow: "hidden",
          }}>
            {filtered.map(a => (
              <button key={a} onClick={() => add(a)} style={{
                width: "100%", padding: "11px 14px", background: "transparent",
                border: "none", cursor: "pointer", textAlign: "left",
                fontSize: "13px", fontFamily: "ui-monospace, monospace", color: C.text,
                transition: "background 0.1s",
              }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = C.bgAlt}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "transparent"}
              >
                ✈ {a}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Dubai Page ────────────────────────────────────────────────
function DubaiPage({ user, onBack }: { user: { email: string } | null; onBack: () => void }) {
  const [continents, setContinents] = useState<string[]>([]);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [days, setDays] = useState(["0", "1", "2"]);
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0]);
  const [phone, setPhone] = useState("");
  const [airlines, setAirlines] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleContinent = (id: string) => {
    if (id === "any") { setContinents(["any"]); return; }
    setContinents(prev => { const w = prev.filter(c => c !== "any"); return w.includes(id) ? w.filter(c => c !== id) : [...w, id]; });
  };
  const toggleDay = (d: string) => setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!phone.trim() || phone.length < 6) e.phone = "Enter a valid phone number";
    if (!budget || isNaN(Number(budget)) || Number(budget) <= 0) e.budget = "Enter a valid budget";
    if (continents.length === 0) e.continents = "Select at least one destination";
    if (days.length === 0) e.days = "Select at least one travel day";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setScanning(true);
    setTimeout(() => { setScanning(false); setSubmitted(true); }, 2500);
  };

  const dayLabels: Record<string, string> = { "0": "Today", "1": "Tomorrow", "2": "Day after" };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Newsreader', serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ textAlign: "center", maxWidth: "420px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", margin: "0 auto 32px", color: C.green }}>✓</div>
          <h2 style={{ fontSize: "36px", fontWeight: "400", letterSpacing: "-0.02em", marginBottom: "16px", color: C.text }}>
            Monitoring <em style={{ color: C.accent }}>activated.</em>
          </h2>
          <p style={{ color: C.textMid, lineHeight: "1.8", fontSize: "14px", marginBottom: "8px", fontFamily: "ui-monospace, monospace" }}>
            Hi {name.split(" ")[0]}, we&apos;re scanning all departures from Dubai every 5 minutes.
          </p>
          <p style={{ color: C.textMid, lineHeight: "1.8", fontSize: "14px", marginBottom: "32px", fontFamily: "ui-monospace, monospace" }}>
            You&apos;ll receive a WhatsApp on <strong style={{ color: C.text }}>{countryCode.code} {phone}</strong> as soon as we find seats within your ${Number(budget).toLocaleString()} budget.
          </p>
          <div style={{ padding: "18px 24px", borderRadius: "12px", border: `1px solid ${C.border}`, background: "#fff", fontSize: "13px", color: C.textMid, lineHeight: "1.8", fontFamily: "ui-monospace, monospace", marginBottom: "32px" }}>
            Active for <span style={{ color: C.text, fontWeight: "500" }}>48 hours</span> · Reply <span style={{ color: C.text, fontWeight: "500" }}>STOP</span> to cancel anytime
          </div>
          <button onClick={onBack} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.textMid, padding: "10px 24px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontFamily: "ui-monospace, monospace" }}>← Back to cities</button>
        </div>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;1,400;1,500&display=swap'); * { box-sizing: border-box; }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Newsreader', serif", color: C.text }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 48px", borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        <button onClick={onBack} style={{ background: "transparent", border: "none", color: C.textMid, cursor: "pointer", fontSize: "13px", fontFamily: "ui-monospace, monospace" }}>← SOSAirways</button>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {user && <span style={{ fontSize: "12px", fontFamily: "ui-monospace, monospace", color: C.textMid }}>{user.email}</span>}
          <div style={{ fontSize: "12px", fontFamily: "ui-monospace, monospace", color: C.textMid, border: `1px solid ${C.border}`, padding: "6px 14px", borderRadius: "100px", display: "flex", alignItems: "center", gap: "8px", background: "#fff" }}>
            <span>🇦🇪</span> Dubai · DXB
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "64px 32px 80px" }}>
        <div style={{ marginBottom: "56px" }}>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 54px)", fontWeight: "400", lineHeight: "1.1", margin: "0 0 16px", color: C.text, letterSpacing: "-0.02em" }}>
            Set up your<br /><em style={{ color: C.accent }}>flight monitoring.</em>
          </h1>
          <p style={{ color: C.textMid, fontSize: "14px", lineHeight: "1.7", fontFamily: "ui-monospace, monospace" }}>
            We&apos;ll alert you on WhatsApp the moment seats become available.
          </p>
        </div>

        {/* Name */}
        <Section number="01" title="Your full name">
          <input
            type="text" placeholder="Jane Smith"
            value={name} onChange={e => setName(e.target.value)}
            onFocus={() => setFocusedField("name")}
            onBlur={() => setFocusedField(null)}
            style={inputStyle(focusedField === "name", !!errors.name)}
          />
          {errors.name && <div style={{ fontSize: "12px", color: C.error, marginTop: "6px", fontFamily: "ui-monospace, monospace" }}>{errors.name}</div>}
        </Section>

        {/* WhatsApp */}
        <Section number="02" title="Your WhatsApp number">
          <div style={{ display: "flex" }}>
            <CountryCodePicker value={countryCode} onChange={setCountryCode} />
            <input
              type="tel" placeholder="50 123 4567"
              value={phone} onChange={e => setPhone(e.target.value)}
              onFocus={() => setFocusedField("phone")}
              onBlur={() => setFocusedField(null)}
              style={{
                ...inputStyle(focusedField === "phone", !!errors.phone),
                borderRadius: "0 8px 8px 0",
                borderLeft: "none",
              }}
            />
          </div>
          {errors.phone && <div style={{ fontSize: "12px", color: C.error, marginTop: "6px", fontFamily: "ui-monospace, monospace" }}>{errors.phone}</div>}
          <div style={{ fontSize: "12px", color: C.textLight, marginTop: "8px", fontFamily: "ui-monospace, monospace" }}>
            Alerts only · Reply STOP anytime
          </div>
        </Section>

        {/* Destinations */}
        <Section number="03" title="Where are you willing to travel?">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {CONTINENTS.map(c => (
              <button key={c.id} onClick={() => toggleContinent(c.id)} style={{
                padding: "9px 16px", borderRadius: "8px", cursor: "pointer",
                fontSize: "13px", fontFamily: "ui-monospace, monospace",
                background: continents.includes(c.id) ? C.accent : "#fff",
                border: `1px solid ${continents.includes(c.id) ? C.accent : C.border}`,
                color: continents.includes(c.id) ? "#fff" : C.textMid,
                transition: "all 0.15s", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}>{c.emoji} {c.label}</button>
            ))}
          </div>
          {errors.continents && <div style={{ fontSize: "12px", color: C.error, marginTop: "8px", fontFamily: "ui-monospace, monospace" }}>{errors.continents}</div>}
        </Section>

        {/* Passengers */}
        <Section number="04" title="How many passengers?">
          <div style={{ display: "flex", gap: "48px" }}>
            <Counter label="Adults" value={adults} min={1} max={9} onChange={setAdults} />
            <Counter label="Children" value={children} min={0} max={9} onChange={setChildren} />
          </div>
        </Section>

        {/* Days */}
        <Section number="05" title="When do you need to travel?">
          <div style={{ display: "flex", gap: "8px" }}>
            {["0", "1", "2"].map(d => (
              <button key={d} onClick={() => toggleDay(d)} style={{
                padding: "9px 20px", borderRadius: "8px", cursor: "pointer",
                fontSize: "13px", fontFamily: "ui-monospace, monospace",
                background: days.includes(d) ? C.accent : "#fff",
                border: `1px solid ${days.includes(d) ? C.accent : C.border}`,
                color: days.includes(d) ? "#fff" : C.textMid,
                transition: "all 0.15s", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}>{dayLabels[d]}</button>
            ))}
          </div>
          {errors.days && <div style={{ fontSize: "12px", color: C.error, marginTop: "8px", fontFamily: "ui-monospace, monospace" }}>{errors.days}</div>}
        </Section>

        {/* Budget */}
        <Section number="06" title="Maximum budget per ticket (USD)">
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: C.textMid, fontFamily: "ui-monospace, monospace", fontSize: "14px", pointerEvents: "none" }}>$</span>
            <input
              type="number" placeholder="500"
              value={budget} onChange={e => setBudget(e.target.value)}
              onFocus={() => setFocusedField("budget")}
              onBlur={() => setFocusedField(null)}
              style={{ ...inputStyle(focusedField === "budget", !!errors.budget), paddingLeft: "28px" }}
              min={0}
            />
          </div>
          {errors.budget && <div style={{ fontSize: "12px", color: C.error, marginTop: "6px", fontFamily: "ui-monospace, monospace" }}>{errors.budget}</div>}
          <div style={{ fontSize: "12px", color: C.textLight, marginTop: "8px", fontFamily: "ui-monospace, monospace" }}>
            We&apos;ll only alert you for flights within this price per person
          </div>
        </Section>

        {/* Airlines */}
        <Section number="07" title="Preferred airlines (optional)">
          <AirlineSelector value={airlines} onChange={setAirlines} />
          <div style={{ fontSize: "12px", color: C.textLight, marginTop: "8px", fontFamily: "ui-monospace, monospace" }}>
            Leave empty to see all available airlines
          </div>
        </Section>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={scanning}
          style={{
            width: "100%", padding: "15px", borderRadius: "10px",
            background: C.accent, border: `1px solid ${C.accent}`,
            cursor: "pointer", color: "#fff",
            fontSize: "14px", fontFamily: "ui-monospace, monospace",
            letterSpacing: "0.03em", transition: "all 0.2s",
            boxShadow: "0 4px 16px rgba(45,27,105,0.25)",
          }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#1e1154"}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = C.accent}
        >
          {scanning ? "Activating..." : "Start monitoring →"}
        </button>
        <div style={{ textAlign: "center", fontSize: "12px", color: C.textLight, marginTop: "12px", fontFamily: "ui-monospace, monospace" }}>
          48 hours of monitoring · Cancel anytime · Secure payment via Stripe
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: #c8c4bc; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        button { font-family: inherit; }
      `}</style>
    </div>
  );
}

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "40px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "16px" }}>
        <span style={{ fontSize: "10px", color: C.accent, letterSpacing: "0.15em", fontFamily: "ui-monospace, monospace", background: C.accentLight, padding: "3px 8px", borderRadius: "100px" }}>{number}</span>
        <span style={{ fontSize: "14px", color: C.textMid, fontFamily: "ui-monospace, monospace" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function Counter({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div style={{ fontSize: "11px", color: C.textLight, fontFamily: "ui-monospace, monospace", letterSpacing: "0.1em", marginBottom: "12px" }}>{label.toUpperCase()}</div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button onClick={() => onChange(Math.max(min, value - 1))} style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#fff", border: `1px solid ${C.border}`, color: C.textMid, cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>−</button>
        <span style={{ fontSize: "22px", color: C.text, minWidth: "24px", textAlign: "center", fontWeight: "500" }}>{value}</span>
        <button onClick={() => onChange(Math.min(max, value + 1))} style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#fff", border: `1px solid ${C.border}`, color: C.textMid, cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>+</button>
      </div>
    </div>
  );
}

// ── App Router ────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");
  const [city, setCity] = useState<string | null>(null);
  const [user, setUser] = useState<{ email: string } | null>(null);

  if (page === "city" && city === "dubai") {
    if (!user) {
      return <AuthPage onAuth={(u) => setUser(u)} onBack={() => setPage("landing")} />;
    }
    return <DubaiPage user={user} onBack={() => { setPage("landing"); setUser(null); }} />;
  }
  return <LandingPage onSelectCity={(code) => { setCity(code); setPage("city"); }} />;
}
