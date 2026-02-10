-- Core schema for browser-based matching service MVP
-- PostgreSQL 15+ / Supabase compatible

create extension if not exists pgcrypto;

-- =========
-- Enums
-- =========
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_status') then
    create type user_status as enum ('active', 'suspended', 'deleted');
  end if;
  if not exists (select 1 from pg_type where typname = 'kyc_status') then
    create type kyc_status as enum ('pending', 'verified', 'rejected');
  end if;
  if not exists (select 1 from pg_type where typname = 'profile_visibility') then
    create type profile_visibility as enum ('visible', 'hidden');
  end if;
  if not exists (select 1 from pg_type where typname = 'terms_type') then
    create type terms_type as enum ('tos', 'privacy', 'community_guideline');
  end if;
  if not exists (select 1 from pg_type where typname = 'consent_value') then
    create type consent_value as enum ('allow', 'deny', 'discuss');
  end if;
  if not exists (select 1 from pg_type where typname = 'match_status') then
    create type match_status as enum ('active', 'closed');
  end if;
  if not exists (select 1 from pg_type where typname = 'report_category') then
    create type report_category as enum ('harassment', 'impersonation', 'scam', 'illegal', 'other');
  end if;
  if not exists (select 1 from pg_type where typname = 'report_severity') then
    create type report_severity as enum ('low', 'medium', 'high', 'critical');
  end if;
  if not exists (select 1 from pg_type where typname = 'report_status') then
    create type report_status as enum ('open', 'investigating', 'resolved', 'rejected');
  end if;
  if not exists (select 1 from pg_type where typname = 'moderation_action') then
    create type moderation_action as enum ('warn', 'freeze', 'suspend', 'unsuspend', 'ban');
  end if;
  if not exists (select 1 from pg_type where typname = 'deletion_status') then
    create type deletion_status as enum ('requested', 'processing', 'completed', 'cancelled');
  end if;
end
$$;

-- =========
-- Helpers
-- =========
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_adult(birth_date date)
returns boolean
language sql
immutable
as $$
  select birth_date <= (current_date - interval '18 years')::date;
$$;

create or replace function public.assert_adult_user()
returns trigger
language plpgsql
as $$
begin
  if not public.is_adult(new.birth_date) then
    raise exception 'user must be at least 18 years old';
  end if;
  return new;
end;
$$;

create or replace function public.block_audit_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'audit_logs is append-only';
end;
$$;

-- =========
-- Users and compliance
-- =========
create table if not exists public.app_users (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname varchar(32) not null unique,
  birth_date date not null,
  region_code varchar(16),
  status user_status not null default 'active',
  kyc_status kyc_status not null default 'pending',
  profile_visibility profile_visibility not null default 'visible',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_set_updated_at_app_users on public.app_users;
create trigger trg_set_updated_at_app_users
before update on public.app_users
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_assert_adult_user on public.app_users;
create trigger trg_assert_adult_user
before insert or update of birth_date on public.app_users
for each row execute procedure public.assert_adult_user();

create table if not exists public.kyc_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.app_users(id) on delete cascade,
  provider text not null,
  provider_session_id text not null unique,
  identity_hash char(64) not null,
  status kyc_status not null default 'pending',
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_set_updated_at_kyc_verifications on public.kyc_verifications;
create trigger trg_set_updated_at_kyc_verifications
before update on public.kyc_verifications
for each row execute procedure public.set_updated_at();

create unique index if not exists uq_kyc_provider_identity_verified
on public.kyc_verifications(provider, identity_hash)
where status = 'verified';

create table if not exists public.terms_versions (
  id uuid primary key default gen_random_uuid(),
  type terms_type not null,
  version varchar(20) not null,
  published_at timestamptz not null,
  content_url text not null,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (type, version)
);

drop trigger if exists trg_set_updated_at_terms_versions on public.terms_versions;
create trigger trg_set_updated_at_terms_versions
before update on public.terms_versions
for each row execute procedure public.set_updated_at();

create table if not exists public.user_terms_consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.app_users(id) on delete cascade,
  terms_version_id uuid not null references public.terms_versions(id) on delete restrict,
  consented_at timestamptz not null default now(),
  ip_hash char(64),
  created_at timestamptz not null default now(),
  unique (user_id, terms_version_id)
);

-- =========
-- Matching profile
-- =========
create table if not exists public.consent_catalog (
  code text primary key,
  label text not null,
  category text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_set_updated_at_consent_catalog on public.consent_catalog;
create trigger trg_set_updated_at_consent_catalog
before update on public.consent_catalog
for each row execute procedure public.set_updated_at();

create table if not exists public.user_consents (
  user_id uuid not null references public.app_users(id) on delete cascade,
  consent_code text not null references public.consent_catalog(code) on delete restrict,
  value consent_value not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, consent_code)
);

drop trigger if exists trg_set_updated_at_user_consents on public.user_consents;
create trigger trg_set_updated_at_user_consents
before update on public.user_consents
for each row execute procedure public.set_updated_at();

create table if not exists public.user_boundaries (
  user_id uuid not null references public.app_users(id) on delete cascade,
  boundary_key text not null,
  boundary_value text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, boundary_key)
);

drop trigger if exists trg_set_updated_at_user_boundaries on public.user_boundaries;
create trigger trg_set_updated_at_user_boundaries
before update on public.user_boundaries
for each row execute procedure public.set_updated_at();

create table if not exists public.tags (
  id bigserial primary key,
  name text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_set_updated_at_tags on public.tags;
create trigger trg_set_updated_at_tags
before update on public.tags
for each row execute procedure public.set_updated_at();

create table if not exists public.user_tags (
  user_id uuid not null references public.app_users(id) on delete cascade,
  tag_id bigint not null references public.tags(id) on delete restrict,
  weight smallint not null default 1 check (weight between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, tag_id)
);

drop trigger if exists trg_set_updated_at_user_tags on public.user_tags;
create trigger trg_set_updated_at_user_tags
before update on public.user_tags
for each row execute procedure public.set_updated_at();

-- =========
-- Like / match / messaging
-- =========
create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid not null references public.app_users(id) on delete cascade,
  to_user_id uuid not null references public.app_users(id) on delete cascade,
  created_at timestamptz not null default now(),
  check (from_user_id <> to_user_id),
  unique (from_user_id, to_user_id)
);

create index if not exists idx_likes_to_user_id on public.likes(to_user_id);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  user_low_id uuid not null references public.app_users(id) on delete cascade,
  user_high_id uuid not null references public.app_users(id) on delete cascade,
  score numeric(5, 2),
  status match_status not null default 'active',
  created_at timestamptz not null default now(),
  check (user_low_id < user_high_id),
  unique (user_low_id, user_high_id)
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null unique references public.matches(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_user_id uuid not null references public.app_users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 3000),
  sent_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_messages_conversation_sent_at
on public.messages(conversation_id, sent_at desc);

-- =========
-- Safety / moderation
-- =========
create table if not exists public.user_blocks (
  blocker_user_id uuid not null references public.app_users(id) on delete cascade,
  blocked_user_id uuid not null references public.app_users(id) on delete cascade,
  reason text,
  created_at timestamptz not null default now(),
  primary key (blocker_user_id, blocked_user_id),
  check (blocker_user_id <> blocked_user_id)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_user_id uuid not null references public.app_users(id) on delete cascade,
  target_user_id uuid not null references public.app_users(id) on delete cascade,
  conversation_id uuid references public.conversations(id) on delete set null,
  message_id uuid references public.messages(id) on delete set null,
  category report_category not null,
  detail text not null check (char_length(detail) between 10 and 4000),
  severity report_severity not null default 'medium',
  status report_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_set_updated_at_reports on public.reports;
create trigger trg_set_updated_at_reports
before update on public.reports
for each row execute procedure public.set_updated_at();

create table if not exists public.moderation_actions (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references public.reports(id) on delete set null,
  action_type moderation_action not null,
  target_user_id uuid not null references public.app_users(id) on delete cascade,
  operator_user_id uuid not null references public.app_users(id) on delete restrict,
  note text,
  acted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id bigserial primary key,
  actor_user_id uuid references public.app_users(id) on delete set null,
  actor_role text not null,
  event_type text not null,
  target_type text not null,
  target_id text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

drop trigger if exists trg_block_audit_log_mutation_update on public.audit_logs;
create trigger trg_block_audit_log_mutation_update
before update on public.audit_logs
for each row execute procedure public.block_audit_mutation();

drop trigger if exists trg_block_audit_log_mutation_delete on public.audit_logs;
create trigger trg_block_audit_log_mutation_delete
before delete on public.audit_logs
for each row execute procedure public.block_audit_mutation();

create table if not exists public.account_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.app_users(id) on delete cascade,
  requested_at timestamptz not null default now(),
  scheduled_purge_at timestamptz not null,
  status deletion_status not null default 'requested',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_set_updated_at_account_deletion_requests on public.account_deletion_requests;
create trigger trg_set_updated_at_account_deletion_requests
before update on public.account_deletion_requests
for each row execute procedure public.set_updated_at();

-- =========
-- Row-level security (MVP-safe defaults)
-- =========
alter table public.app_users enable row level security;
alter table public.kyc_verifications enable row level security;
alter table public.user_terms_consents enable row level security;
alter table public.user_consents enable row level security;
alter table public.user_boundaries enable row level security;
alter table public.user_tags enable row level security;
alter table public.likes enable row level security;
alter table public.matches enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.user_blocks enable row level security;
alter table public.reports enable row level security;
alter table public.account_deletion_requests enable row level security;

-- app_users
drop policy if exists app_users_select_visible_or_self on public.app_users;
create policy app_users_select_visible_or_self on public.app_users
for select using (
  id = auth.uid()
  or (
    profile_visibility = 'visible'
    and status = 'active'
    and kyc_status = 'verified'
  )
);

drop policy if exists app_users_update_self on public.app_users;
create policy app_users_update_self on public.app_users
for update using (id = auth.uid()) with check (id = auth.uid());

-- kyc_verifications
drop policy if exists kyc_select_self on public.kyc_verifications;
create policy kyc_select_self on public.kyc_verifications
for select using (user_id = auth.uid());

-- user_terms_consents
drop policy if exists user_terms_consents_select_self on public.user_terms_consents;
create policy user_terms_consents_select_self on public.user_terms_consents
for select using (user_id = auth.uid());

drop policy if exists user_terms_consents_insert_self on public.user_terms_consents;
create policy user_terms_consents_insert_self on public.user_terms_consents
for insert with check (user_id = auth.uid());

-- user_consents
drop policy if exists user_consents_crud_self on public.user_consents;
create policy user_consents_crud_self on public.user_consents
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- user_boundaries
drop policy if exists user_boundaries_crud_self on public.user_boundaries;
create policy user_boundaries_crud_self on public.user_boundaries
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- user_tags
drop policy if exists user_tags_crud_self on public.user_tags;
create policy user_tags_crud_self on public.user_tags
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- likes
drop policy if exists likes_select_party on public.likes;
create policy likes_select_party on public.likes
for select using (from_user_id = auth.uid() or to_user_id = auth.uid());

drop policy if exists likes_insert_self on public.likes;
create policy likes_insert_self on public.likes
for insert with check (from_user_id = auth.uid());

drop policy if exists likes_delete_self on public.likes;
create policy likes_delete_self on public.likes
for delete using (from_user_id = auth.uid());

-- matches
drop policy if exists matches_select_party on public.matches;
create policy matches_select_party on public.matches
for select using (user_low_id = auth.uid() or user_high_id = auth.uid());

-- conversations
drop policy if exists conversations_select_party on public.conversations;
create policy conversations_select_party on public.conversations
for select using (
  exists (
    select 1
    from public.matches m
    where m.id = conversations.match_id
      and (m.user_low_id = auth.uid() or m.user_high_id = auth.uid())
  )
);

-- messages
drop policy if exists messages_select_party on public.messages;
create policy messages_select_party on public.messages
for select using (
  exists (
    select 1
    from public.conversations c
    join public.matches m on m.id = c.match_id
    where c.id = messages.conversation_id
      and (m.user_low_id = auth.uid() or m.user_high_id = auth.uid())
  )
);

drop policy if exists messages_insert_sender on public.messages;
create policy messages_insert_sender on public.messages
for insert with check (
  sender_user_id = auth.uid()
  and exists (
    select 1
    from public.conversations c
    join public.matches m on m.id = c.match_id
    where c.id = messages.conversation_id
      and m.status = 'active'
      and (m.user_low_id = auth.uid() or m.user_high_id = auth.uid())
  )
);

-- user_blocks
drop policy if exists user_blocks_crud_self on public.user_blocks;
create policy user_blocks_crud_self on public.user_blocks
for all using (blocker_user_id = auth.uid()) with check (blocker_user_id = auth.uid());

-- reports
drop policy if exists reports_select_reporter on public.reports;
create policy reports_select_reporter on public.reports
for select using (reporter_user_id = auth.uid());

drop policy if exists reports_insert_reporter on public.reports;
create policy reports_insert_reporter on public.reports
for insert with check (reporter_user_id = auth.uid());

-- account deletion requests
drop policy if exists account_deletion_crud_self on public.account_deletion_requests;
create policy account_deletion_crud_self on public.account_deletion_requests
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- =========
-- Seed minimal consent catalog
-- =========
insert into public.consent_catalog (code, label, category, is_active)
values
  ('chat_style_direct', '直接的なチャット表現', 'communication', true),
  ('voice_call_allowed', '音声通話可否', 'communication', true),
  ('photo_exchange', '写真交換可否', 'privacy', true),
  ('first_meeting_public_place', '初回は公共の場所', 'safety', true)
on conflict (code) do update
set label = excluded.label,
    category = excluded.category,
    is_active = excluded.is_active;
