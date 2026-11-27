-- CloScam community flags.
-- Apply this file to project vusmbjommrojkgbjgvwz.
-- Anon has no table access. The Next.js server calls the functions below
-- with the publishable key. Reporter hashes are computed on that server.

create table if not exists public.community_reports (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  subject_type text not null check (subject_type in ('phone', 'url', 'business', 'message')),
  subject_key text not null,
  scam_type text not null,
  description text not null,
  has_evidence boolean not null default false,
  reporter_hash text not null,
  created_at timestamptz not null default pg_catalog.now(),
  unique (subject_type, subject_key, reporter_hash)
);

create table if not exists public.community_disputes (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  subject_type text not null,
  subject_key text not null,
  note text not null,
  reporter_hash text not null,
  created_at timestamptz not null default pg_catalog.now(),
  unique (subject_type, subject_key, reporter_hash)
);

create table if not exists public.community_api_keys (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  key_hash text not null unique,
  label text not null,
  created_at timestamptz not null default pg_catalog.now()
);

create index if not exists community_reports_subject_idx
  on public.community_reports (subject_type, subject_key);

alter table public.community_reports enable row level security;
alter table public.community_disputes enable row level security;
alter table public.community_api_keys enable row level security;

revoke all on table public.community_reports from public, anon, authenticated;
revoke all on table public.community_disputes from public, anon, authenticated;
revoke all on table public.community_api_keys from public, anon, authenticated;

create or replace function public.submit_report(
  p_subject_type text,
  p_subject_key text,
  p_scam_type text,
  p_description text,
  p_has_evidence boolean,
  p_reporter_hash text
) returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_subject_type not in ('phone', 'url', 'business', 'message') then
    raise exception 'bad type';
  end if;
  if p_subject_type = 'phone' and p_subject_key !~ '^\+233[0-9]{9}$' then
    raise exception 'bad phone';
  end if;
  if pg_catalog.char_length(p_subject_key) < 2 or pg_catalog.char_length(p_subject_key) > 180 then
    raise exception 'bad key';
  end if;
  if pg_catalog.char_length(p_scam_type) < 2 or pg_catalog.char_length(p_scam_type) > 40 then
    raise exception 'bad scam type';
  end if;
  if pg_catalog.char_length(p_description) < 8 or pg_catalog.char_length(p_description) > 400 then
    raise exception 'bad description';
  end if;
  if pg_catalog.char_length(p_reporter_hash) < 16 or pg_catalog.char_length(p_reporter_hash) > 128 then
    raise exception 'bad reporter';
  end if;

  insert into public.community_reports (
    subject_type, subject_key, scam_type, description, has_evidence, reporter_hash
  ) values (
    p_subject_type, p_subject_key, p_scam_type, p_description, coalesce(p_has_evidence, false), p_reporter_hash
  )
  on conflict (subject_type, subject_key, reporter_hash) do nothing;
end;
$$;

create or replace function public.lookup_flag(
  p_subject_type text,
  p_subject_key text
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_count integer;
  v_last timestamptz;
  v_types text[];
  v_dispute boolean;
  v_status text;
begin
  if p_subject_type not in ('phone', 'url', 'business') then
    raise exception 'bad type';
  end if;
  if pg_catalog.char_length(p_subject_key) < 2 or pg_catalog.char_length(p_subject_key) > 180 then
    raise exception 'bad key';
  end if;

  select count(distinct reporter_hash), max(created_at)
    into v_count, v_last
  from public.community_reports
  where subject_type = p_subject_type and subject_key = p_subject_key;

  select coalesce(array_agg(distinct scam_type), array[]::text[])
    into v_types
  from public.community_reports
  where subject_type = p_subject_type and subject_key = p_subject_key;

  select exists (
    select 1 from public.community_disputes
    where subject_type = p_subject_type and subject_key = p_subject_key
  ) into v_dispute;

  v_status := case
    when v_count >= 3 then 'flagged'
    when v_count >= 1 then 'reported_unverified'
    else 'clean_unknown'
  end;

  return pg_catalog.jsonb_build_object(
    'status', v_status,
    'reportCount', v_count,
    'scamTypes', to_jsonb(v_types),
    'lastReported', v_last,
    'disputeOpen', v_dispute
  );
end;
$$;

create or replace function public.submit_dispute(
  p_subject_type text,
  p_subject_key text,
  p_note text,
  p_reporter_hash text
) returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_subject_type not in ('phone', 'url', 'business', 'message') then
    raise exception 'bad type';
  end if;
  if pg_catalog.char_length(p_subject_key) < 2 or pg_catalog.char_length(p_subject_key) > 180 then
    raise exception 'bad key';
  end if;
  if pg_catalog.char_length(p_note) < 8 or pg_catalog.char_length(p_note) > 400 then
    raise exception 'bad note';
  end if;
  if pg_catalog.char_length(p_reporter_hash) < 16 or pg_catalog.char_length(p_reporter_hash) > 128 then
    raise exception 'bad reporter';
  end if;

  insert into public.community_disputes (subject_type, subject_key, note, reporter_hash)
  values (p_subject_type, p_subject_key, p_note, p_reporter_hash)
  on conflict (subject_type, subject_key, reporter_hash) do nothing;
end;
$$;

create or replace function public.issue_api_key(
  p_key_hash text,
  p_label text
) returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_key_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'bad key hash';
  end if;
  if pg_catalog.char_length(p_label) < 2 or pg_catalog.char_length(p_label) > 60 then
    raise exception 'bad label';
  end if;

  insert into public.community_api_keys (key_hash, label)
  values (p_key_hash, p_label);
end;
$$;

create or replace function public.verify_api_key(
  p_key_hash text
) returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_key_hash !~ '^[0-9a-f]{64}$' then
    return false;
  end if;
  return exists (
    select 1 from public.community_api_keys where key_hash = p_key_hash
  );
end;
$$;

revoke all on function public.submit_report(text, text, text, text, boolean, text) from public;
revoke all on function public.lookup_flag(text, text) from public;
revoke all on function public.submit_dispute(text, text, text, text) from public;
revoke all on function public.issue_api_key(text, text) from public;
revoke all on function public.verify_api_key(text) from public;

grant execute on function public.submit_report(text, text, text, text, boolean, text) to anon;
grant execute on function public.lookup_flag(text, text) to anon;
grant execute on function public.submit_dispute(text, text, text, text) to anon;
grant execute on function public.issue_api_key(text, text) to anon;
grant execute on function public.verify_api_key(text) to anon;
