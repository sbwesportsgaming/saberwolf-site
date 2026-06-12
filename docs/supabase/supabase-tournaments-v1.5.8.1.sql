-- v1.5.8.1 — Torneios reais no Supabase
-- Execute este SQL no Supabase SQL Editor antes de testar criação/listagem real de torneios.
-- Esta tabela guarda os torneios criados por organizadores aprovados no painel -SBW-.

create table if not exists public.tournaments (
  id uuid primary key default gen_random_uuid(),

  slug text not null unique,
  title text not null,
  description text,
  rules text,
  prize_text text,

  game_id text,
  game_name text not null,
  platform text not null default 'crossplay',
  format text not null default 'double-elimination',
  status text not null default 'draft',
  visibility text not null default 'public',

  -- Vínculo com a entidade/organização de torneios.
  -- tournament_organizer_id pode referenciar o UUID real quando disponível.
  tournament_organizer_id uuid references public.tournament_organizers(id) on delete set null,
  organizer_id text,
  organizer_slug text,
  organizer_name text,

  max_participants integer,
  current_participants integer not null default 0,

  registration_opens_at timestamptz,
  registration_closes_at timestamptz,
  checkin_starts_at timestamptz,
  starts_at timestamptz,
  ends_at timestamptz,

  cover_url text,
  settings jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,

  created_by_auth_user_id uuid references auth.users(id) on delete set null,
  created_by_profile_id text references public.profiles(id) on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint tournaments_status_check check (
    status in (
      'draft',
      'registration-open',
      'open',
      'published',
      'scheduled',
      'structure-generated',
      'in-progress',
      'running',
      'finished',
      'completed',
      'cancelled',
      'archived'
    )
  ),
  constraint tournaments_visibility_check check (
    visibility in ('public', 'private', 'unlisted')
  ),
  constraint tournaments_max_participants_check check (
    max_participants is null or (max_participants >= 2 and max_participants <= 256)
  ),
  constraint tournaments_current_participants_check check (
    current_participants >= 0
  )
);

create index if not exists idx_tournaments_slug
  on public.tournaments (slug);

create index if not exists idx_tournaments_status
  on public.tournaments (status);

create index if not exists idx_tournaments_visibility
  on public.tournaments (visibility);

create index if not exists idx_tournaments_starts_at
  on public.tournaments (starts_at);

create index if not exists idx_tournaments_organizer_slug
  on public.tournaments (organizer_slug);

create index if not exists idx_tournaments_organizer_id
  on public.tournaments (organizer_id);

create index if not exists idx_tournaments_created_by_auth_user_id
  on public.tournaments (created_by_auth_user_id);

create or replace function public.set_tournaments_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_tournaments_updated_at
  on public.tournaments;

create trigger trg_tournaments_updated_at
before update on public.tournaments
for each row
execute function public.set_tournaments_updated_at();

alter table public.tournaments enable row level security;

-- Leitura pública dos torneios públicos/listados.
drop policy if exists "Public can read public tournaments" on public.tournaments;
create policy "Public can read public tournaments"
on public.tournaments
for select
using (visibility in ('public', 'unlisted'));

-- Criação autenticada: o front-end já bloqueia usuários sem permissão.
-- Na fase seguinte podemos endurecer esta policy usando site_permissions/tournament_organizer_members.
drop policy if exists "Authenticated organizers can create tournaments" on public.tournaments;
create policy "Authenticated organizers can create tournaments"
on public.tournaments
for insert
to authenticated
with check (auth.uid() = created_by_auth_user_id);

-- O criador original pode atualizar seus torneios nesta fase inicial.
drop policy if exists "Creators can update own tournaments" on public.tournaments;
create policy "Creators can update own tournaments"
on public.tournaments
for update
to authenticated
using (auth.uid() = created_by_auth_user_id)
with check (auth.uid() = created_by_auth_user_id);

-- O criador original pode excluir torneios próprios nesta fase inicial.
drop policy if exists "Creators can delete own tournaments" on public.tournaments;
create policy "Creators can delete own tournaments"
on public.tournaments
for delete
to authenticated
using (auth.uid() = created_by_auth_user_id);
