# Changelog

## Session 1 — March 5, 2026

### Infrastructure
- Created Next.js app (App Router, TypeScript, no src/)
- Deployed to Vercel at www.sosairways.com
- Connected domain via Namecheap DNS
- GitHub repo: santamouss/sosairways

### Auth
- NextAuth with Google OAuth
- Session cookie set to sameSite: lax for Stripe redirect compatibility

### Frontend
- Landing page with city grid (Dubai active, others coming soon)
- Auth page (Google login + email/password toggle)
- Dubai form: name, country code picker, WhatsApp, continents, passengers, days, budget, preferred airlines
- Dashboard: active session, time remaining, edit preferences, cancel
- /dubai/success confirmation page

### Payment
- Stripe Checkout integration ($20 one-time)
- Draft saved to Supabase before payment
- Activated after Stripe success webhook

### Database
- Supabase project: bsjspxnpqnezqjgnifiz
- Table: monitoring_sessions (see CURSOR.md for columns)
- RLS enabled (permissive policy for now)

### PythoBackend (local only)
- scan_flights.py — FlightRadar24 API, returns 48 viable DXB flights
- pipeline.py — scans + sends WhatsApp alerts
- verify_flight.py — Browser Use agent on Google Flights
- test_whatsapp.py — Twilio WhatsApp test (working)
- First WhatsApp alert sent successfully

### Next Session Goals
- Connect form submission to Python pipeline
- Trigger scan automatically after payment
- Store monitored flights per user in Supabase
- Agent checks only NEW flot every scan)
- Send real WhatsApp alerts with booking URLs
