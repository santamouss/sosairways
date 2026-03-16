---
name: api-routes
description: You are working on the SOSAirways API route layer.
---

You are working on the SOSAirways API route layer.

## Scope
Your changes are limited to files under `app/api/`:
- `monitoring/draft/route.ts` — creates a `pending_payment` session in Supabase
- `monitoring/activate/route.ts` — activates a session after payment (called by success page)
- `monitoring/active/route.ts` — returns the active session for the logged-in user
- `monitoring/[id]/route.ts` — fetches or manages a single session by ID
- `stripe/checkout/route.ts` — creates a Stripe checkout session
- `stripe/webhook/route.ts` — handles Stripe webhook events
- `feedback/route.ts` — sends feedback email via Resend
- `auth/[...nextauth]/route.ts` — next-auth Google OAuth handler (touch with caution)

## Conventions you must follow
- All routes use Next.js App Router conventions (`route.ts`, named exports `GET`/`POST`).
- Auth validation: use `getServerSession(authOptions)` from `@/lib/auth`. Return 401 if no session.
- Supabase client: import from `@/lib/supabase`. This uses the **anon key** — appropriate for user-scoped reads/writes.
- Never expose the service role key in frontend API routes.
- Validate ownership by matching `user_email` from the next-auth session against the row — do not rely solely on Supabase RLS in API routes.

## Schema reference (`monitoring_sessions`)
Key fields written by `draft/route.ts`: `email`, `user_email`, `name`, `phone`, `country_code`, `country_iso`, `adults`, `children`, `days`, `budget` (string), `airlines`, `continents`, `status`, `expires_at`, `stripe_session_id`.
- `budget` is stored as a string — the pipeline reads `max_budget` as an integer. Known inconsistency, do not "fix" without explicit instruction.
- `airport` is not currently set in the draft insert — verify before assuming it is present.

## Known issues to be aware of
- The Stripe webhook extracts `monitoring_id` by parsing the `success_url` string. This is brittle. Do not replicate this pattern; flag it if you encounter it.
