-- v1.5.9.5 — Diagnóstico seguro para Beta Online -SBW-
-- Execute no Supabase SQL Editor antes de liberar testadores.
-- Este arquivo NÃO apaga dados e NÃO altera policies. Ele apenas mostra situações para revisar.

-- 1) Tabelas esperadas e RLS ativo.
with expected_tables(table_name) as (
  values
    ('profiles'),
    ('teams'),
    ('team_members'),
    ('team_invites'),
    ('team_transfer_requests'),
    ('tournament_organizers'),
    ('tournament_organizer_members'),
    ('tournaments'),
    ('tournament_participants')
)
select
  e.table_name,
  case when c.oid is null then 'missing' else 'ok' end as table_status,
  coalesce(c.relrowsecurity, false) as rls_enabled
from expected_tables e
left join pg_class c
  on c.relname = e.table_name
left join pg_namespace n
  on n.oid = c.relnamespace
  and n.nspname = 'public'
order by e.table_name;

-- 2) Policies principais cadastradas nas tabelas sensíveis.
select
  schemaname,
  tablename,
  policyname,
  cmd,
  roles
from pg_policies
where schemaname = 'public'
  and tablename in (
    'profiles',
    'teams',
    'team_members',
    'team_invites',
    'team_transfer_requests',
    'tournament_organizers',
    'tournament_organizer_members',
    'tournaments',
    'tournament_participants'
  )
order by tablename, policyname;

-- 3) Índices de bloqueio de inscrição duplicada.
select
  indexname,
  indexdef
from pg_indexes
where schemaname = 'public'
  and tablename = 'tournament_participants'
  and indexname in (
    'idx_tournament_participants_unique_active_user',
    'idx_tournament_participants_unique_active_user_slug'
  )
order by indexname;

-- 4) Duplicidades ativas que impediriam a proteção correta de inscrição.
select
  tournament_id,
  tournament_slug,
  auth_user_id,
  count(*) as active_rows
from public.tournament_participants
where status in ('registered', 'waitlist')
group by tournament_id, tournament_slug, auth_user_id
having count(*) > 1
order by active_rows desc;

-- 5) Participantes fake/teste que devem ser removidos antes do beta real.
select
  id,
  tournament_slug,
  player_name,
  player_slug,
  status,
  check_in_status,
  metadata,
  created_at
from public.tournament_participants
where
  metadata->>'testSeed' = 'true'
  or metadata->>'seededBy' ilike 'v1.%test%'
  or player_slug ilike 'teste-player-%'
  or player_name ilike 'Teste Player%'
order by created_at desc;

-- 6) Torneios recentes para revisar status/contagem antes do beta.
select
  title,
  slug,
  status,
  visibility,
  current_participants,
  max_participants,
  organizer_name,
  organizer_slug,
  created_at,
  updated_at
from public.tournaments
order by updated_at desc
limit 25;

-- 7) Contagem real de inscritos ativos comparada ao current_participants.
with participant_counts as (
  select
    coalesce(tournament_slug, tournament_id) as tournament_ref,
    count(*) filter (where status in ('registered', 'waitlist')) as active_count
  from public.tournament_participants
  group by coalesce(tournament_slug, tournament_id)
)
select
  t.title,
  t.slug,
  t.current_participants,
  coalesce(pc.active_count, 0) as counted_active_participants,
  case
    when t.current_participants = coalesce(pc.active_count, 0) then 'ok'
    else 'review'
  end as count_status
from public.tournaments t
left join participant_counts pc
  on pc.tournament_ref = t.slug
  or pc.tournament_ref = t.id::text
order by t.updated_at desc;

-- 8) Usuários/organizadores aprovados para criar torneios.
select
  t.created_by_auth_user_id,
  t.created_by_profile_id,
  count(*) as tournaments_created,
  max(t.updated_at) as last_tournament_update
from public.tournaments t
group by t.created_by_auth_user_id, t.created_by_profile_id
order by last_tournament_update desc;

-- 9) Recarregar schema cache da API REST após qualquer SQL estrutural.
-- notify pgrst, 'reload schema';
