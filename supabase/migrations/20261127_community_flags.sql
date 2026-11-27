-- CloScam community flags. Apply in the Supabase SQL editor when
-- SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set on the server.
-- The service role is server-only. These tables have no anon policies.

create table if not exists public.community_reports (
  id uuid primary key default gen_random_uuid(),
  subject_type text not null check (subject_type in ('phone', 'url', 'business', 'message')),
  subject_key text not null,
  scam_type text not null,
  description text not null,
  has_evidence boolean not null default false,
  reporter_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.community_disputes (
  id uuid primary key default gen_random_uuid(),
  subject_type text not null,
  subject_key text not null,
  note text not null,
  created_at timestamptz not null default now()
);

create index if not exists community_reports_subject_idx
  on public.community_reports (subject_type, subject_key);

create table if not exists public.community_api_keys (
  id uuid primary key default gen_random_uuid(),
  key_hash text not null unique,
  label text not null,
  created_at timestamptz not null default now()
);

alter table public.community_reports enable row level security;
alter table public.community_disputes enable row level security;

alter table public.community_api_keys enable row level security;

revoke all on public.community_reports from anon, authenticated;
revoke all on public.community_disputes from anon, authenticated;
revoke all on public.community_api_keys from anon, authenticated;
