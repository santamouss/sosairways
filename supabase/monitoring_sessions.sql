-- Run this in Supabase SQL Editor to create the monitoring_sessions table.

create table if not exists public.monitoring_sessions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text not null,
  phone text not null,
  country_code text not null,
  country_iso text,
  continents text[] not null default '{}',
  adults int not null default 1,
  children int not null default 0,
  days text[] not null default '{}',
  budget text not null,
  airlines text[] not null default '{}',
  status text not null check (status in ('pending_payment', 'active', 'cancelled')) default 'pending_payment',
  expires_at timestamptz,
  stripe_session_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS: enable and allow all for anon key. API routes enforce auth and filter by session email.
-- For production, use SUPABASE_SERVICE_ROLE_KEY in API and restrict RLS to service role only.
alter table public.monitoring_sessions enable row level security;

create policy "Allow all for monitoring_sessions"
  on public.monitoring_sessions for all
  using (true)
  with check (true);
