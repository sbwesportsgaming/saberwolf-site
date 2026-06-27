-- =========================================================
-- v1.6.80.1 — Admin Master: controle de Organizações de Torneios
-- Plataforma -SBW-
-- =========================================================
-- Adiciona RPCs administrativas para listar, arquivar e excluir
-- definitivamente Organizações de Torneios.
--
-- Arquivar:
-- - mantém a organização no banco;
-- - marca status=archived;
-- - oculta/arquiva torneios vinculados;
-- - preserva histórico para o Admin Master.
--
-- Excluir definitivo:
-- - remove participantes de torneios vinculados;
-- - remove torneios vinculados;
-- - remove staff/membros da organização;
-- - remove a organização do banco.
-- Use somente para testes, demos ou cadastros criados errado.
-- =========================================================

create or replace function public.sbw_admin_can_manage_organizations()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return false;
  end if;

  begin
    if public.sbw_admin_panel_can_manage() then
      return true;
    end if;
  exception when undefined_function then
    -- fallback abaixo
  end;

  begin
    if public.sbw_is_platform_admin() then
      return true;
    end if;
  exception when undefined_function then
    -- sem fallback extra
  end;

  return false;
end;
$$;

grant execute on function public.sbw_admin_can_manage_organizations() to authenticated;

create or replace function public.sbw_admin_list_tournament_organizers()
returns setof jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.sbw_admin_can_manage_organizations() then
    raise exception 'Apenas Admin Master/Admin SBW pode listar Organizacoes de Torneios.';
  end if;

  return query
  select
    to_jsonb(o)
    || jsonb_build_object(
      'tournament_count', (
        select count(*)
        from public.tournaments t
        where coalesce(t.tournament_organizer_id::text, '') = o.id::text
           or coalesce(t.organizer_id::text, '') = o.id::text
           or lower(coalesce(t.organizer_slug, '')) = lower(coalesce(o.slug, ''))
      ),
      'member_count', (
        select case
          when to_regclass('public.tournament_organizer_members') is null then 0
          else (
            select count(*)
            from public.tournament_organizer_members m
            where coalesce(m.organizer_id::text, '') = o.id::text
               or lower(coalesce(m.organizer_slug, '')) = lower(coalesce(o.slug, ''))
          )
        end
      )
    )
  from public.tournament_organizers o
  order by coalesce(o.updated_at, o.created_at) desc nulls last, o.name asc;
end;
$$;

grant execute on function public.sbw_admin_list_tournament_organizers() to authenticated;

drop function if exists public.sbw_admin_manage_tournament_organizer(text, text, text);

create or replace function public.sbw_admin_manage_tournament_organizer(
  p_organizer text,
  p_action text,
  p_reason text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  target public.tournament_organizers%rowtype;
  normalized_action text := lower(trim(coalesce(p_action, '')));
  previous_status text;
  next_metadata jsonb;
  affected_tournaments integer := 0;
  affected_participants integer := 0;
  affected_members integer := 0;
  deleted_organizers integer := 0;
begin
  if not public.sbw_admin_can_manage_organizations() then
    raise exception 'Apenas Admin Master/Admin SBW pode executar acoes administrativas em Organizacoes de Torneios.';
  end if;

  if nullif(trim(coalesce(p_organizer, '')), '') is null then
    raise exception 'Organizacao de Torneios nao informada.';
  end if;

  if normalized_action not in ('archive', 'delete') then
    raise exception 'Acao administrativa invalida para organizacao: %', p_action;
  end if;

  select * into target
  from public.tournament_organizers o
  where o.id::text = trim(p_organizer)
     or lower(coalesce(o.slug, '')) = lower(trim(p_organizer))
  limit 1;

  if target.id is null then
    raise exception 'Organizacao de Torneios nao encontrada.';
  end if;

  previous_status := coalesce(target.status, 'active');

  if normalized_action = 'archive' then
    next_metadata := coalesce(target.metadata, '{}'::jsonb)
      || jsonb_build_object(
        'adminManaged', true,
        'adminArchived', true,
        'adminDeleted', false,
        'adminLastAction', jsonb_build_object(
          'action', 'archive',
          'previousStatus', previous_status,
          'reason', nullif(p_reason, ''),
          'adminAuthUserId', auth.uid(),
          'at', now()
        )
      );

    update public.tournament_organizers
       set status = 'archived',
           metadata = next_metadata,
           updated_at = now()
     where id = target.id
     returning * into target;

    update public.tournaments t
       set status = case
             when coalesce(t.status, '') in ('finished', 'completed') then t.status
             else 'archived'
           end,
           visibility = 'private',
           metadata = coalesce(t.metadata, '{}'::jsonb) || jsonb_build_object(
             'adminManaged', true,
             'adminArchived', true,
             'adminArchiveReason', 'organizer_archived',
             'adminLastAction', jsonb_build_object(
               'action', 'archive_due_organizer_archive',
               'organizerId', target.id,
               'organizerSlug', target.slug,
               'reason', nullif(p_reason, ''),
               'adminAuthUserId', auth.uid(),
               'at', now()
             )
           ),
           updated_at = now()
     where coalesce(t.tournament_organizer_id::text, '') = target.id::text
        or coalesce(t.organizer_id::text, '') = target.id::text
        or lower(coalesce(t.organizer_slug, '')) = lower(coalesce(target.slug, ''));

    get diagnostics affected_tournaments = row_count;

    return jsonb_build_object(
      'ok', true,
      'action', 'archive',
      'message', 'Organizacao arquivada e torneios vinculados ocultados.',
      'affectedTournaments', affected_tournaments,
      'organizer', to_jsonb(target)
    );
  end if;

  -- Excluir definitivo: remove torneios vinculados e depois a organização.
  delete from public.tournament_participants p
  using public.tournaments t
  where p.tournament_id::text = t.id::text
    and (
      coalesce(t.tournament_organizer_id::text, '') = target.id::text
      or coalesce(t.organizer_id::text, '') = target.id::text
      or lower(coalesce(t.organizer_slug, '')) = lower(coalesce(target.slug, ''))
    );
  get diagnostics affected_participants = row_count;

  delete from public.tournaments t
  where coalesce(t.tournament_organizer_id::text, '') = target.id::text
     or coalesce(t.organizer_id::text, '') = target.id::text
     or lower(coalesce(t.organizer_slug, '')) = lower(coalesce(target.slug, ''));
  get diagnostics affected_tournaments = row_count;

  if to_regclass('public.tournament_organizer_members') is not null then
    delete from public.tournament_organizer_members m
    where coalesce(m.organizer_id::text, '') = target.id::text
       or lower(coalesce(m.organizer_slug, '')) = lower(coalesce(target.slug, ''));
    get diagnostics affected_members = row_count;
  end if;

  delete from public.tournament_organizers o
  where o.id = target.id;
  get diagnostics deleted_organizers = row_count;

  return jsonb_build_object(
    'ok', deleted_organizers > 0,
    'action', 'delete',
    'message', 'Organizacao excluida definitivamente do banco.',
    'deletedOrganizers', deleted_organizers,
    'deletedTournaments', affected_tournaments,
    'deletedParticipants', affected_participants,
    'deletedMembers', affected_members,
    'organizer', to_jsonb(target)
  );
end;
$$;

grant execute on function public.sbw_admin_manage_tournament_organizer(text, text, text) to authenticated;

notify pgrst, 'reload schema';
