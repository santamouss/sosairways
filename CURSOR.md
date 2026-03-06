# SOSAirways — Cursor Context

## What this is
Emergency evacuation flight monitoring service. Users pay $20, we scan all flights departing their city every 5 minutes, send WhatsApp alerts when seats are available.

## Live URL
https://www.sosairways.com

## Tech Stack
- Next.js (App Router, no src/ dir, TypeScript)
- NextAuth — Google OAuth
- Supabase — monitoring_sessions table
- Stripe — $20 one-time payment
- Twilio — WhatsApp alerts
- Python backend — scan_flights.py, pipeline.py, verify_flight.py
- Deployed on Vercel, GitHub: santamouss/sosairways

## Design System
- Background: #FAF8F5 (cream)
- Accent: #2D1B69 (deep purple)
- Font: Newsreader serif (headings), ui-monospace (body/labels)
- All components use inline styles (no Tailwind classes)

## Pages
- / — landing page + auth + Dubai form (all in app/page.tsx)
- /dashboard — active monitoring session, edit, cancel
- /dubai/success — post-payment confirmation
- /api/auth/[...nextauth] — Google OAuth
- /a creates Stripe session
- /api/monitoring/draft — saves form before payment
- /api/monitoring/active — gets active session
- /api/monitoring/[id] — get/update session

## Supabase Table: monitoring_sessions
id, user_email, email, name, country_code, country_iso, phone,
continents, adults, children, days, airlines, budget, airport,
status, stripe_session_id, created_at, expires_at, updated_at

## Pythonnd (local only, not deployed yet)
Located at: ~/Desktop/SOS Airways/
- scan_flights.py — calls FlightRadar24 API, returns viable flights
- pipeline.py — scans + sends WhatsApp via Twilio
- verify_flight.py — Browser Use agent, searches Google Flights
- test_whatsapp.py — test Twilio connection
- .env — ANTHROPIC_API_KEY, TWILIO keys, MY_WHATSAPP_NUMBER

## Key Decisions
- No src/ directory
- App Router only
- Stripe test keys in dev, live keys for production
- RLS on monitoring_sessions is permissive (tighten later)
- 48 hour monitoring window per payment

## Do NOT change
- Auth flow (NextAuth + Google)
- Stripe integration
- Supabase sout adding a migration
- Design colors and fonts
