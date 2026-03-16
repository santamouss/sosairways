# SOSAirways — Claude Code Context

> This file is the single source of truth for Claude Code agents working on this project.
> Read this fully before making any changes.

---

## What is SOSAirways?

SOSAirways is an emergency flight monitoring service for people stuck in conflict-affected Middle Eastern cities trying to evacuate. It monitors every departure from a given airport every 5 minutes and sends a WhatsApp alert the moment seats open up — with price, destination, and a direct booking link.

**Live at:** www.sosairways.com
**GitHub (frontend):** santamouss/sosairways
**GitHub (pipeline):** santamouss/sosairways-pipeline

---

## Stack

| Layer | Technology | Hosting |
|-------|-----------|---------|
| Frontend | Next.js (App Router, inline styles) | Vercel |
| Auth | next-auth (Google OAuth) | - |
| Background pipeline | Python 3.11 (asyncio) | Railway |
| Database | Supabase (Postgres + RLS) | Supabase |
| Flight data | SerpAPI (Google Flights) | - |
| Alerts | Twilio WhatsApp | - |
| Payments | Stripe (webhooks) | - |
| Email | Resend | - |

---

## Architecture

```
User pays via Stripe
        ↓
Stripe webhook → /api/stripe/webhook → activates session in Supabase
        ↓
Railway pipeline picks up active session (polls every 5 min)
        ↓
Checks FlightRadar24 for departures from airport
        ↓
SerpAPI checks price/availability for each flight
        ↓
Twilio sends WhatsApp alert to user
```

**Critical:** Vercel runs the Next.js frontend and API routes. Railway runs the always-on Python pipeline. These are complementary — Vercel functions time out, so the pipeline must live on Railway.

---

## Auth

Auth is handled via **next-auth** with **Google OAuth**. API routes validate the logged-in user with `getServerSession(authOptions)` from `@/lib/auth`.

Supabase RLS is enforced in the pipeline (service role key bypasses it). The frontend API routes do **not** rely on Supabase RLS for ownership — they validate via the next-auth session email instead.

---

## Supabase Schema

**Tables:**
- `monitoring_sessions` — one row per user session (airport, budget, continents, status, welcome_sent)
- `flight_scans` — dedup log per session+flight combo
- `serpapi_results` — raw SerpAPI responses
- `agent_results` — legacy (Browser Use removed)
- `alerts_sent` — log of WhatsApp alerts sent
- `profiles` — user profiles

**Key columns in `monitoring_sessions`:**
- `email` / `user_email` — both set to the same value (next-auth email); redundant columns
- `airport` — IATA code (e.g. "DXB")
- `name` — user's full name
- `phone` — user's phone number (without country code)
- `country_code` — e.g. "+971"
- `country_iso` — e.g. "AE"
- `adults` — integer, number of adult passengers
- `children` — integer, number of child passengers
- `days` — array of days of the week the user wants to fly (e.g. ["Monday", "Friday"])
- `budget` — string (e.g. "500"); **inconsistency: pipeline reads `max_budget` as integer — do not fix yet**
- `airlines` — array of preferred airline codes (can be empty)
- `continents` — array of destination continents
- `status` — `pending_payment` | `active` | `expired`
- `welcome_sent` — boolean, pipeline sets to true after first message

**RLS:** Enabled on all tables. Pipeline uses service role key (bypasses RLS). Frontend uses anon key (users see only their own sessions).

---

## Environment Variables

### Vercel (frontend)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`

### Railway (pipeline)
- `SUPABASE_URL`
- `SUPABASE_KEY` — service role key (not anon)
- `SERPAPI_KEY`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_FROM` — `whatsapp:+14153902946`
- `ANTHROPIC_API_KEY`

---

## Key File Map

### Frontend (`/sosairways`)
```
app/
  page.tsx                          — landing page + all UI components
  dubai/
    page.tsx                        — Dubai city page
    success/page.tsx                — post-payment success page
  api/
    monitoring/route.ts             — creates pending_payment session
    monitoring/activate/route.ts    — activates session (called by success page)
    monitoring/active/route.ts      — gets active session for logged-in user
    stripe/checkout/route.ts        — creates Stripe checkout session
    stripe/webhook/route.ts         — handles Stripe webhook, activates session
    feedback/route.ts               — sends feedback email via Resend
next.config.ts                      — security headers (CSP, HSTS, X-Frame-Options)
```

### Pipeline (repo root)
```
pipeline.py           — main loop, session management, WhatsApp sending
serpapi_check.py      — flight availability checks via SerpAPI
get_booking_url.py    — URL shortening + WhatsApp message formatter (imports Browser Use but that code path is not called by the live pipeline — dead import, kept for reference)
scan_flights.py       — standalone dev/debug script for testing FlightRadar24 departures; not imported by anything, not part of the live pipeline
```

---

## Adding a New Airport — Checklist

This is the exact process to roll out a new city. Agents must follow this order:

### 1. Verify FlightRadar24 support
Check that the airport IATA code returns departures:
```
https://api.flightradar24.com/common/v1/airport.json?code={IATA}&plugin=schedule&plugin-setting[schedule][mode]=departures&limit=100
```

### 2. Frontend — activate city in selector
In `app/page.tsx`, find the cities array and change the new city from `active: false` to `active: true`.

### 3. Frontend — create city page
Create `app/{cityslug}/page.tsx` modelled on `app/dubai/page.tsx`.
- Update airport code, city name, country, flag emoji

### 4. Frontend — create success page
Create `app/{cityslug}/success/page.tsx` modelled on `app/dubai/success/page.tsx`.
- Update city name and airport code references

### 5. Frontend — update API route
In `app/api/monitoring/route.ts`, ensure the new airport code is accepted.

### 6. Pipeline — verify no hardcoded airport filters
In `pipeline.py` and `serpapi_check.py`, confirm there are no hardcoded `DXB` references that would block other airports. The pipeline should read `airport` from the session row dynamically.

### 7. Test end to end
- Create a test session in Supabase with the new airport and `status: active`
- Confirm pipeline picks it up and scans correctly
- Confirm WhatsApp alert fires with correct airport data

---

## Coding Conventions

- **Styles:** Inline styles only. No Tailwind, no CSS modules.
- **Colors:** Use the `C` color constants object defined at the top of `page.tsx`
- **Fonts:** Serif (`Newsreader`) for headlines, monospace (`ui-monospace`) for labels/stats
- **API routes:** All in `app/api/`, use Next.js App Router conventions (`route.ts`)
- **No Browser Use:** The Browser Use agent was removed from the call path due to memory issues. `get_booking_url.py` still imports it but `get_booking_url()` is never called by the live pipeline. Do not re-add it or invoke it.
- **No hardcoded airport codes** in pipeline logic — always read from session data

---

## Current Airport Status

| City | IATA | Status |
|------|------|--------|
| Dubai | DXB | ✅ Live |
| Riyadh | RUH | 🔜 Soon |
| Beirut | BEY | 🔜 Soon |
| Doha | DOH | 🔜 Soon |
| Kuwait | KWI | 🔜 Soon |

---

## WhatsApp Templates (pending Meta approval)

Three Twilio content templates submitted:
- `sos_welcome` — sent on first pipeline cycle
- `sos_flight_alert` — sent when flight found
- `sos_session_expired` — sent when 48h session ends

Until approved, pipeline sends freeform messages (works within 24h user-initiated window).

---

## Known Issues / Pending Work

- [ ] WhatsApp template Meta approval pending
- [ ] Session expiry notification not yet implemented in pipeline
- [ ] Timezone bug: dashboard shows 54h instead of 48h
- [ ] Auto-renewal / subscription logic deferred
- [ ] monitored_flights table (change detection) not yet built
- [ ] Continents filter not enforced in pipeline — users select destination continents at signup but `scan_and_check` checks all non-Middle-East destinations regardless; needs scoping before fixing

---

## Transition: Cursor → Claude Code

This project was previously developed using **Cursor** as the primary coding tool. We are now moving to **Claude Code** for all future development.

**What this means:**
- All previous changes were made via Cursor's inline AI suggestions and chat — there is no prior Claude Code session history
- The codebase is in a working, production state — do not refactor or restructure anything unless explicitly asked
- Claude Code should treat this as a brownfield project: read first, ask questions, then act
- Do not make assumptions about missing context — if something is unclear, ask before touching code

**How we want to work with Claude Code:**
- For new airport rollouts: follow the checklist in "Adding a New Airport" above autonomously
- For other tasks: confirm scope and approach before making changes
- Always read the relevant files before editing them
- Commit messages should be clear and reference what changed and why

---

## Questions for Claude Code

Before making any changes, confirm:
1. Have you read this entire CLAUDE.md file?
2. Have you reviewed all the files shared in this session?
3. Do you have any questions about the architecture, conventions, or codebase before starting?
4. What is the specific task — which airport, which layer (frontend / pipeline / both)?
