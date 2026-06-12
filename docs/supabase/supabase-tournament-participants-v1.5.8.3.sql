-- v1.5.8.3 — Inscrições reais em torneios + contagem automática
-- Execute este SQL no Supabase SQL Editor antes de testar inscrição real.
-- Objetivo:
-- 1) Criar/atualizar public.tournament_participants.
-- 2) Permitir que jogador autenticado inscreva apenas a própria conta.
-- 3) Mostrar inscritos públicos na página do torneio.
-- 4) Atualizar automaticamente tournaments.current_participants.

create table if not exists public.tournament_participants (
  id uuid primary key default gen_random_uuid(),

  -- Mantido como text para aceitar tanto UUID real do torneio quanto slug durante a migração.
  -- A função de contagem abaixo compara com tournaments.id::text e também com tournaments.slug.
  tournament_id text not null,
  tournament_slug text,
  tournament_name text,

  auth_user_id uuid not null references auth.users(id) on delete cascade,

  -- profiles.id no projeto atual é text/slug público criado pelo Auth Header.
  profile_id text,

  player_name text not null,
  player_slug text,
  team_name text,

  status text not null default 'registered',
  check_in_status text not null default 'pending',
  seed integer,

  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tournament_participants
  add column if not exists tournament_slug text,
  add column if not exists tournament_name text,
  add column if not exists profile_id text,
  add column if not exists player_slug text,
  add column if not exists team_name text,
  add column if not exists check_in_status text not null default 'pending',
  add column if not exists seed integer,
  add column if not exists metadata jsonb not null default '{}'::jsonb,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.tournament_participants
  drop constraint if exists tournament_participants_unique_user,
  drop constraint if exists tournament_participants_status_check,
  drop constraint if exists tournament_participants_checkin_status_check;

alter table public.tournament_participants
  add constraint tournament_participants_status_check check (
    status in ('registered', 'waitlist', 'cancelled', 'removed', 'disqualified')
  ),
  add constraint tournament_participants_checkin_status_check check (
    check_in_status in ('pending', 'checked_in', 'missed', 'waived')
  );

-- Impede duas inscrições ativas do mesmo usuário no mesmo torneio,
-- mas permite histórico se futuramente ele cancelar e reinscrever.
create unique index if not exists idx_tournament_participants_unique_active_user
  on public.tournament_participants (tournament_id, auth_user_id)
  where status in ('registered', 'waitlist');

-- Proteção extra quando o torneio é localizado por slug público.
create unique index if not exists idx_tournament_participants_unique_active_user_slug
  on public.tournament_participants (tournament_slug, auth_user_id)
  where tournament_slug is not null
    and trim(tournament_slug) <> ''
    and status in ('registered', 'waitlist');

create index if not exists idx_tournament_participants_tournament_id
  on public.tournament_participants (tournament_id);

create index if not exists idx_tournament_participants_auth_user_id
  on public.tournament_participants (auth_user_id);

create index if not exists idx_tournament_participants_profile_id
  on public.tournament_participants (profile_id);

create or replace function public.set_tournament_participants_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_tournament_participants_updated_at
  on public.tournament_participants;

create trigger trg_tournament_participants_updated_at
before update on public.tournament_participants
for each row
execute function public.set_tournament_participants_updated_at();

-- Atualiza current_participants no torneio sempre que houver inscrição/cancelamento/remoção.
create or replace function public.sbw_recount_tournament_participants(p_tournament_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_tournament_id is null or trim(p_tournament_id) = '' then
    return;
  end if;

  update public.tournaments t
  set
    current_participants = (
      select count(*)::integer
      from public.tournament_participants tp
      where tp.status in ('registered', 'waitlist')
        and (
          tp.tournament_id = t.id::text
          or tp.tournament_id = t.slug
          or tp.tournament_slug = t.slug
          or tp.tournament_slug = t.id::text
        )
    ),
    updated_at = now()
  where t.id::text = p_tournament_id
     or t.slug = p_tournament_id;
end;
$$;

create or replace function public.sbw_sync_tournament_participants_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- INSERT: reconta o torneio novo.
  if tg_op = 'INSERT' then
    perform public.sbw_recount_tournament_participants(new.tournament_id);
    return new;
  end if;

  -- UPDATE: reconta o torneio atual e, se a inscrição mudou de torneio, reconta o antigo também.
  if tg_op = 'UPDATE' then
    perform public.sbw_recount_tournament_participants(new.tournament_id);

    if old.tournament_id is distinct from new.tournament_id then
      perform public.sbw_recount_tournament_participants(old.tournament_id);
    end if;

    return new;
  end if;

  -- DELETE: NEW não existe em trigger de delete; por isso tratamos separado.
  if tg_op = 'DELETE' then
    perform public.sbw_recount_tournament_participants(old.tournament_id);
    return old;
  end if;

  return null;
end;
$$;

drop trigger if exists trg_tournament_participants_sync_count
  on public.tournament_participants;

create trigger trg_tournament_participants_sync_count
after insert or update or delete on public.tournament_participants
for each row
execute function public.sbw_sync_tournament_participants_count();

alter table public.tournament_participants enable row level security;

grant select on public.tournament_participants to anon, authenticated;
grant insert, update, delete on public.tournament_participants to authenticated;

-- Página pública do torneio pode ver inscrições ativas.
drop policy if exists "Public can read tournament participants" on public.tournament_participants;
drop policy if exists "tournament_participants_public_read" on public.tournament_participants;
create policy "tournament_participants_public_read"
on public.tournament_participants
for select
to anon, authenticated
using (
  status in ('registered', 'waitlist')
  or auth.uid() = auth_user_id
);

-- Jogador autenticado só cria inscrição para a própria conta.
drop policy if exists "Authenticated users can register themselves" on public.tournament_participants;
drop policy if exists "tournament_participants_insert_own" on public.tournament_participants;
create policy "tournament_participants_insert_own"
on public.tournament_participants
for insert
to authenticated
with check (
  auth.uid() = auth_user_id
  and status in ('registered', 'waitlist')
);

-- Fluxos futuros: check-in/cancelamento da própria inscrição.
drop policy if exists "Users can update own tournament registration" on public.tournament_participants;
drop policy if exists "tournament_participants_update_own" on public.tournament_participants;
create policy "tournament_participants_update_own"
on public.tournament_participants
for update
to authenticated
using (auth.uid() = auth_user_id)
with check (auth.uid() = auth_user_id);

drop policy if exists "Users can delete own tournament registration" on public.tournament_participants;
drop policy if exists "tournament_participants_delete_own" on public.tournament_participants;
create policy "tournament_participants_delete_own"
on public.tournament_participants
for delete
to authenticated
using (auth.uid() = auth_user_id);

-- Reconta torneios já existentes, útil se você já testou inscrições antes deste patch.
select public.sbw_recount_tournament_participants(id::text)
from public.tournaments;

notify pgrst, 'reload schema';
