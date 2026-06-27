-- =========================================================
-- v1.6.79.6 — Admin Master: arquivar e excluir definitivo
-- Plataforma -SBW-
-- =========================================================
-- Regra:
-- - Arquivar: remove da visão pública e dos organizadores, preservando histórico.
-- - Excluir: remove definitivamente do banco de dados.
-- =========================================================

create or replace function public.sbw_admin_panel_can_manage()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_auth_id text := coalesce(auth.uid()::text, '');
  current_email text := lower(coalesce(auth.jwt()->>'email', ''));
  row_json jsonb;
begin
  if auth.uid() is null then
    return false;
  end if;

  begin
    if public.sbw_is_platform_admin() then
      return true;
    end if;
  exception when undefined_function then
    -- fallback abaixo
  end;

  for row_json in
    select to_jsonb(p)
    from public.profiles p
    where p.auth_user_id::text = current_auth_id
       or p.id::text = current_auth_id
       or lower(coalesce(p.email, '')) = current_email
  loop
    if coalesce((row_json->'permissions'->>'isMasterAdmin')::boolean, false)
       or coalesce((row_json->'permissions'->>'is_master_admin')::boolean, false)
       or coalesce((row_json->'permissions'->>'isAdminSbw')::boolean, false)
       or coalesce((row_json->'permissions'->>'is_admin_sbw')::boolean, false)
       or coalesce((row_json->'permissions'->>'canManagePermissions')::boolean, false)
       or coalesce((row_json->'permissions'->>'can_manage_permissions')::boolean, false)
       or coalesce((row_json->'metadata'->'permissions'->>'isMasterAdmin')::boolean, false)
       or coalesce((row_json->'metadata'->'permissions'->>'is_master_admin')::boolean, false)
       or coalesce((row_json->'metadata'->'permissions'->>'isAdminSbw')::boolean, false)
       or coalesce((row_json->'metadata'->'permissions'->>'is_admin_sbw')::boolean, false)
       or coalesce((row_json->'metadata'->'permissions'->>'canManagePermissions')::boolean, false)
       or coalesce((row_json->'metadata'->'permissions'->>'can_manage_permissions')::boolean, false)
    then
      return true;
    end if;
  end loop;

  return false;
end;
$$;

grant execute on function public.sbw_admin_panel_can_manage() to authenticated;

create or replace function public.sbw_admin_delete_rows_by_text_match(
  p_table_name text,
  p_column_name text,
  p_values text[]
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count integer := 0;
begin
  if p_table_name is null or p_column_name is null or coalesce(array_length(p_values, 1), 0) = 0 then
    return 0;
  end if;

  if to_regclass('public.' || p_table_name) is null then
    return 0;
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = p_table_name
      and column_name = p_column_name
  ) then
    return 0;
  end if;

  execute format('delete from public.%I where %I::text = any($1)', p_table_name, p_column_name)
    using p_values;

  get diagnostics deleted_count = row_count;
  return coalesce(deleted_count, 0);
end;
$$;

-- uso interno por RPC administrativa
grant execute on function public.sbw_admin_delete_rows_by_text_match(text, text, text[]) to authenticated;

drop function if exists public.sbw_admin_manage_tournament(text, text, text);

create or replace function public.sbw_admin_manage_tournament(
  p_tournament text,
  p_action text,
  p_reason text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  target_row public.tournaments;
  normalized_action text := lower(trim(coalesce(p_action, '')));
  previous_status text;
  previous_visibility text;
  next_status text;
  next_visibility text;
  next_metadata jsonb;
  match_values text[];
  deleted_participants integer := 0;
begin
  if not public.sbw_admin_panel_can_manage() then
    raise exception 'Apenas Admin Master/Admin SBW pode executar ações administrativas em torneios.';
  end if;

  if nullif(trim(coalesce(p_tournament, '')), '') is null then
    raise exception 'Torneio não informado.';
  end if;

  if normalized_action not in ('draft', 'hide', 'publish', 'archive', 'delete', 'restore') then
    raise exception 'Ação administrativa inválida: %', p_action;
  end if;

  select * into target_row
  from public.tournaments t
  where t.id::text = trim(p_tournament)
     or coalesce(t.slug, '') = trim(p_tournament)
  limit 1;

  if target_row.id is null then
    raise exception 'Torneio não encontrado.';
  end if;

  previous_status := coalesce(target_row.status, 'draft');
  previous_visibility := coalesce(target_row.visibility, 'public');
  next_status := previous_status;
  next_visibility := previous_visibility;
  match_values := array_remove(array[target_row.id::text, target_row.slug], null);

  if normalized_action = 'delete' then
    -- Remove vínculos conhecidos antes de apagar o torneio.
    deleted_participants := deleted_participants + public.sbw_admin_delete_rows_by_text_match('tournament_participants', 'tournament_id', match_values);
    deleted_participants := deleted_participants + public.sbw_admin_delete_rows_by_text_match('tournament_participants', 'tournament_slug', match_values);

    -- Compatibilidade com tabelas futuras/experimentais, caso existam.
    perform public.sbw_admin_delete_rows_by_text_match('tournament_matches', 'tournament_id', match_values);
    perform public.sbw_admin_delete_rows_by_text_match('tournament_matches', 'tournament_slug', match_values);
    perform public.sbw_admin_delete_rows_by_text_match('tournament_rounds', 'tournament_id', match_values);
    perform public.sbw_admin_delete_rows_by_text_match('tournament_rounds', 'tournament_slug', match_values);
    perform public.sbw_admin_delete_rows_by_text_match('tournament_results', 'tournament_id', match_values);
    perform public.sbw_admin_delete_rows_by_text_match('tournament_results', 'tournament_slug', match_values);
    perform public.sbw_admin_delete_rows_by_text_match('tournament_standings', 'tournament_id', match_values);
    perform public.sbw_admin_delete_rows_by_text_match('tournament_standings', 'tournament_slug', match_values);

    delete from public.tournaments
    where id = target_row.id;

    return jsonb_build_object(
      'ok', true,
      'action', 'delete',
      'message', 'Torneio excluído definitivamente do banco de dados.',
      'deletedParticipants', deleted_participants,
      'tournament', to_jsonb(target_row)
    );
  end if;

  if normalized_action = 'draft' then
    next_status := 'draft';
    next_visibility := 'private';
  elsif normalized_action = 'hide' then
    next_visibility := 'private';
    if previous_status in ('public', 'published', 'open', 'registration-open') then
      next_status := 'hidden';
    end if;
  elsif normalized_action = 'publish' then
    next_visibility := 'public';
    if previous_status in ('draft', 'archived', 'deleted', 'hidden', 'cancelled', 'removed') then
      next_status := 'published';
    end if;
  elsif normalized_action = 'archive' then
    next_status := 'archived';
    next_visibility := 'private';
  elsif normalized_action = 'restore' then
    next_status := 'draft';
    next_visibility := 'public';
  end if;

  next_metadata := coalesce(target_row.metadata, '{}'::jsonb)
    || jsonb_build_object(
      'adminLastAction', jsonb_build_object(
        'action', normalized_action,
        'previousStatus', previous_status,
        'previousVisibility', previous_visibility,
        'nextStatus', next_status,
        'nextVisibility', next_visibility,
        'reason', nullif(p_reason, ''),
        'adminAuthUserId', auth.uid(),
        'at', now()
      ),
      'adminManaged', true,
      'adminArchived', normalized_action = 'archive',
      'adminDeleted', false
    );

  update public.tournaments
     set status = next_status,
         visibility = next_visibility,
         metadata = next_metadata,
         updated_at = now()
   where id = target_row.id
   returning * into target_row;

  return jsonb_build_object(
    'ok', true,
    'action', normalized_action,
    'message', case normalized_action
      when 'draft' then 'Torneio marcado como rascunho.'
      when 'hide' then 'Torneio ocultado da área pública.'
      when 'publish' then 'Torneio publicado/reativado.'
      when 'archive' then 'Torneio arquivado e escondido de público/organizadores.'
      when 'restore' then 'Torneio restaurado.'
      else 'Ação administrativa concluída.'
    end,
    'tournament', to_jsonb(target_row)
  );
end;
$$;

grant execute on function public.sbw_admin_manage_tournament(text, text, text) to authenticated;

drop function if exists public.sbw_admin_manage_team(text, text, text);

create or replace function public.sbw_admin_manage_team(
  p_team text,
  p_action text,
  p_reason text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  target_row public.teams;
  normalized_action text := lower(trim(coalesce(p_action, '')));
  previous_status text;
  previous_visibility boolean;
  previous_active boolean;
  next_metadata jsonb;
  match_values text[];
  related_values text[];
  deleted_members integer := 0;
  deleted_invites integer := 0;
begin
  if not public.sbw_admin_panel_can_manage() then
    raise exception 'Apenas Admin Master/Admin SBW pode executar ações administrativas em equipes.';
  end if;

  if nullif(trim(coalesce(p_team, '')), '') is null then
    raise exception 'Equipe não informada.';
  end if;

  if normalized_action not in ('archive', 'delete') then
    raise exception 'Ação administrativa inválida para equipe: %', p_action;
  end if;

  select * into target_row
  from public.teams t
  where t.id::text = trim(p_team)
     or coalesce(t.slug, '') = trim(p_team)
  limit 1;

  if target_row.id is null then
    raise exception 'Equipe não encontrada.';
  end if;

  previous_status := coalesce(target_row.status, 'active');
  previous_visibility := coalesce(target_row.is_public, true);
  previous_active := coalesce(target_row.is_active, true);
  match_values := array_remove(array[target_row.id::text, target_row.slug], null);

  if normalized_action = 'delete' then
    select array_agg(distinct value) into related_values
    from (
      select t.id::text as value
      from public.teams t
      where t.id = target_row.id
         or t.slug = target_row.slug
         or coalesce(t.parent_team_slug, '') = coalesce(target_row.slug, '')
      union
      select t.slug as value
      from public.teams t
      where t.id = target_row.id
         or t.slug = target_row.slug
         or coalesce(t.parent_team_slug, '') = coalesce(target_row.slug, '')
    ) values_query
    where nullif(value, '') is not null;

    if related_values is null then
      related_values := match_values;
    end if;

    deleted_invites := deleted_invites + public.sbw_admin_delete_rows_by_text_match('team_invites', 'team_id', related_values);
    deleted_invites := deleted_invites + public.sbw_admin_delete_rows_by_text_match('team_invites', 'team_slug', related_values);
    deleted_members := deleted_members + public.sbw_admin_delete_rows_by_text_match('team_members', 'team_id', related_values);
    deleted_members := deleted_members + public.sbw_admin_delete_rows_by_text_match('team_members', 'team_slug', related_values);

    -- Compatibilidade com tabelas futuras/experimentais, caso existam.
    perform public.sbw_admin_delete_rows_by_text_match('team_audit_logs', 'team_id', related_values);
    perform public.sbw_admin_delete_rows_by_text_match('team_audit_logs', 'team_slug', related_values);

    -- Remove subequipes diretas antes da equipe principal para evitar bloqueio por referência hierárquica.
    perform public.sbw_admin_delete_rows_by_text_match('teams', 'parent_team_slug', match_values);
    perform public.sbw_admin_delete_rows_by_text_match('teams', 'id', match_values);
    perform public.sbw_admin_delete_rows_by_text_match('teams', 'slug', match_values);

    return jsonb_build_object(
      'ok', true,
      'action', 'delete',
      'message', 'Equipe excluída definitivamente do banco de dados.',
      'deletedMembers', deleted_members,
      'deletedInvites', deleted_invites,
      'team', to_jsonb(target_row)
    );
  end if;

  next_metadata := coalesce(target_row.metadata, '{}'::jsonb)
    || jsonb_build_object(
      'adminLastAction', jsonb_build_object(
        'action', normalized_action,
        'previousStatus', previous_status,
        'previousVisibility', previous_visibility,
        'previousActive', previous_active,
        'reason', nullif(p_reason, ''),
        'adminAuthUserId', auth.uid(),
        'at', now()
      ),
      'adminManaged', true,
      'adminArchived', true,
      'adminDeleted', false
    );

  update public.teams
     set is_active = false,
         is_public = false,
         status = 'archived',
         metadata = next_metadata,
         updated_at = now()
   where id = target_row.id
   returning * into target_row;

  return jsonb_build_object(
    'ok', true,
    'action', 'archive',
    'message', 'Equipe arquivada e escondida da área pública.',
    'team', to_jsonb(target_row)
  );
end;
$$;

grant execute on function public.sbw_admin_manage_team(text, text, text) to authenticated;

notify pgrst, 'reload schema';
