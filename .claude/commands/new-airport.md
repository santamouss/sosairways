You are performing a new airport rollout for SOSAirways. Follow this checklist in order. Do not skip steps.

## Pre-flight
Confirm the following before starting:
- Airport IATA code (e.g. "BEY")
- City name, country, flag emoji, city slug (e.g. "beirut")

## Step 1 — Verify FlightRadar24 support
Check the IATA code returns departure data:
```
https://api.flightradar24.com/common/v1/airport.json?code={IATA}&plugin=schedule&plugin-setting[schedule][mode]=departures&limit=100
```
If no departures are returned, stop and report to the user before continuing.

## Step 2 — Activate city in the selector
File: `app/page.tsx`
Find the `CITIES` array and set `active: true` for the new city.
If the city is not yet in the array, add it following the existing shape:
`{ code: "{cityslug}", name: "{City Name}", airport: "{IATA}", country: "{Country}", active: true, flag: "{emoji}" }`

## Step 3 — Create city redirect page
File: `app/{cityslug}/page.tsx`
Model exactly on `app/dubai/page.tsx` — it is a thin client component that calls `router.replace("/?city={cityslug}")`.
The entire UI lives in `app/page.tsx`; do not build a standalone city page.

## Step 4 — Create success page
File: `app/{cityslug}/success/page.tsx`
Model on `app/dubai/success/page.tsx`.
Update all hardcoded city name references (e.g. "Dubai" → new city name) and the error redirect URL (`/?city={cityslug}`).

## Step 5 — No API route change needed
`app/api/monitoring/draft/route.ts` reads airport from the form payload — no filtering by airport code. No changes required.

## Step 6 — Audit pipeline for hardcoded airport filters
Read `pipeline.py` and `serpapi_check.py`. Confirm there are no hardcoded `DXB` references that would block the new airport. The pipeline must read `airport` dynamically from the session row.
If hardcoded references exist, flag them to the user and do not auto-fix without confirmation.

## Step 7 — Update CLAUDE.md airport status table
Add the new city to the table in `## Current Airport Status` with status `🔜 Soon` (or `✅ Live` if going live immediately).

## Step 8 — Test end to end
- Insert a test row in Supabase `monitoring_sessions` with the new IATA code and `status: active`
- Confirm the Railway pipeline picks it up and scans correctly
- Confirm a WhatsApp alert fires with correct airport data

## Conventions reminder
- Inline styles only. Use the `C` color constants from `page.tsx`.
- No hardcoded airport codes in pipeline logic.
- Commit message format: `feat: add {City} ({IATA}) airport rollout`
