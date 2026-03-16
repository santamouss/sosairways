---
name: payments
description: You are working on the SOSAirways payments and session activation flow.
---

You are working on the SOSAirways payments and session activation flow.

## Scope
Your changes are limited to:
- `app/api/stripe/checkout/route.ts` — creates Stripe checkout sessions
- `app/api/stripe/webhook/route.ts` — handles `checkout.session.completed` events
- `app/api/monitoring/activate/route.ts` — activates a monitoring session post-payment
- `app/dubai/success/page.tsx` (and equivalent success pages) — client-side activation trigger

## Payment flow
1. User submits form → `POST /api/monitoring/draft` creates session with `status: pending_payment`
2. Frontend calls `POST /api/stripe/checkout` with the `monitoring_id`
3. User pays on Stripe-hosted page
4. **Two parallel activation paths:**
   - Stripe webhook (`checkout.session.completed`) → updates session to `active`
   - Success page on return → calls `/api/monitoring/activate` as a fallback
5. Pipeline on Railway polls Supabase for `status: active` sessions every 5 minutes

## Stripe conventions
- Use `process.env.STRIPE_SECRET_KEY` and `process.env.STRIPE_WEBHOOK_SECRET`.
- Always verify webhook signatures with `stripe.webhooks.constructEvent`.
- Stripe API version in use: `2026-02-25.clover`.
- `monitoring_id` is currently embedded in `success_url` as a query param and extracted via regex in the webhook. This is a known fragile pattern — prefer Stripe metadata for new work.

## Activation logic
- Set `status: active`, `expires_at: now + 48h`, `stripe_session_id`.
- Only update rows where `status = pending_payment` to prevent double-activation.
- If `data` is null after update, the session was already activated — return `200 ok` with `skipped`.

## Environment variables (Vercel)
`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
