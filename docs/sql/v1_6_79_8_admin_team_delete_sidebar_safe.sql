-- =========================================================
-- v1.6.79.8 — Hotfix Admin Master: equipes/schema real + sidebar segura
-- Plataforma -SBW-
-- =========================================================
-- Corrige duas frentes:
-- 1) Equipes: remove dependência da coluna inexistente is_active na tabela teams.
-- 2) Sidebar: cria RPC segura para contexto da conta/admin sem consultas .or() frágeis no front.
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
    -- Continua com fallback abaixo.
  end;

  for row_json in
    select to_jsonb(p)
    from public.profiles p
    where coalesce(to_jsonb(p)->>'auth_user_id', '') = current_auth_id
       or coalesce(to_jsonb(p)->>'id', '') = current_auth_id
       or lower(coalesce(to_jsonb(p)->>'email', '')) = current_email
  loop
    if coalesce((row_json->'permissions'->>'isMasterAdmin')::boolean, false)
       or coalesce((row_json->'permissions'->>'is_master_admin')::boolean, false)
       or coalesce((row_json->'permissions'->>'isAdminSbw')::boolean, false)
       or coalesce((row_json->'permissions'->>'is_admin_sbw')::boolean, false)
       or coalesce((row_json->'permissions'->>'isAdmin')::boolean, false)
       or coalesce((row_json->'permissions'->>'is_admin')::boolean, false)
       or coalesce((row_json->'permissions'->>'canManagePermissions')::boolean, false)
       or coalesce((row_json->'permissions'->>'can_manage_permissions')::boolean, false)
       or coalesce((row_json->'metadata'->'permissions'->>'isMasterAdmin')::boolean, false)
       or coalesce((row_json->'metadata'->'permissions'->>'is_master_admin')::boolean, false)
       or coalesce((row_json->'metadata'->'permissions'->>'isAdminSbw')::boolean, false)
       or coalesce((row_json->'metadata'->'permissions'->>'is_admin_sbw')::boolean, false)
       or coalesce((row_json->'metadata'->'permissions'->>'isAdmin')::boolean, false)
       or coalesce((row_json->'metadata'->'permissions'->>'is_admin')::boolean, false)
       or coalesce((row_json->'metadata'->'permissions'->>'canManagePermissions')::boolean, false)
       or coalesce((row_json->'metadata'->'permissions'->>'can_manage_permissions')::boolean, false)
    then
      return true;
    end if;
  end loop;

  if to_regclass('public.site_permissions') is not null then
    for row_json in execute 'select to_jsonb(sp) from public.site_permissions sp' loop
      if lower(coalesce(row_json->>'status', row_json->>'state', 'active')) in ('inactive', 'disabled', 'revoked', 'rejected', 'denied', 'blocked') then
        continue;
      end if;

      if coalesce(row_json->>'auth_user_id', row_json->>'user_id', '') not in ('', current_auth_id)
         and lower(coalesce(row_json->>'email', row_json->>'user_email', '')) not in ('', current_email)
      then
        continue;
      end if;

      if lower(coalesce(row_json->>'permission_key', row_json->>'permission', row_json->>'role', row_json->>'type', '')) in (
        'master',
        'master_admin',
        'admin',
        'admin_sbw',
        'site_admin',
        'staff_admin',
        'permission_admin',
        'permissions_admin',
        'can_manage_permissions'
      )
      or coalesce((row_json->>'isMasterAdmin')::boolean, false)
      or coalesce((row_json->>'is_master_admin')::boolean, false)
      or coalesce((row_json->>'isAdminSbw')::boolean, false)
      or coalesce((row_json->>'is_admin_sbw')::boolean, false)
      or coalesce((row_json->>'isAdmin')::boolean, false)
      or coalesce((row_json->>'is_admin')::boolean, false)
      or coalesce((row_json->>'canManagePermissions')::boolean, false)
      or coalesce((row_json->>'can_manage_permissions')::boolean, false)
      then
        return true;
      end if;
    end loop;
  end if;

  return false;
end;
$$;

grant execute on function public.sbw_admin_panel_can_manage() to authenticated;

create or replace function public.sbw_get_sidebar_context()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_auth_id text := coalesce(auth.uid()::text, '');
  current_email text := lower(coalesce(auth.jwt()->>'email', ''));
  profile_json jsonb := null;
  can_admin boolean := false;
begin
  if auth.uid() is null then
    return jsonb_build_object('ok', false, 'authenticated', false);
  end if;

  select to_jsonb(p)
    into profile_json
  from public.profiles p
  where coalesce(to_jsonb(p)->>'auth_user_id', '') = current_auth_id
     or coalesce(to_jsonb(p)->>'id', '') = current_auth_id
     or lower(coalesce(to_jsonb(p)->>'email', '')) = current_email
  order by coalesce(to_jsonb(p)->>'updated_at', to_jsonb(p)->>'created_at', '') desc
  limit 1;

  begin
    can_admin := public.sbw_admin_panel_can_manage();
  exception when others then
    can_admin := false;
  end;

  return jsonb_build_object(
    'ok', true,
    'authenticated', true,
    'user', jsonb_build_object(
      'id', auth.uid(),
      'email', current_email
    ),
    'email', current_email,
    'profile', profile_json,
    'canAdmin', can_admin,
    'permissions', jsonb_build_object(
      'isAdminSbw', can_admin,
      'canManagePermissions', can_admin
    )
  );
end;
$$;

grant execute on function public.sbw_get_sidebar_context() to authenticated;

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

grant execute on function public.sbw_admin_delete_rows_by_text_match(text, text, text[]) to authenticated;

create or replace function public.sbw_admin_clear_deleted_team_from_profiles(p_values text[])
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  changed_count integer := 0;
  last_count integer := 0;
  column_record record;
begin
  if coalesce(array_length(p_values, 1), 0) = 0 then
    return 0;
  end if;

  if to_regclass('public.profiles') is null then
    return 0;
  end if;

  for column_record in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name in ('current_team_id', 'current_team_slug', 'current_team_name', 'current_team_tag')
  loop
    execute format('update public.profiles set %I = null where %I::text = any($1)', column_record.column_name, column_record.column_name)
      using p_values;
    get diagnostics last_count = row_count;
    changed_count := changed_count + coalesce(last_count, 0);
  end loop;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'metadata'
  ) then
    update public.profiles
       set metadata = coalesce(metadata, '{}'::jsonb) - 'currentTeam' - 'current_team' - 'team'
     where coalesce(metadata->'currentTeam'->>'id', '') = any(p_values)
        or coalesce(metadata->'currentTeam'->>'slug', '') = any(p_values)
        or coalesce(metadata->'current_team'->>'id', '') = any(p_values)
        or coalesce(metadata->'current_team'->>'slug', '') = any(p_values)
        or coalesce(metadata->'team'->>'id', '') = any(p_values)
        or coalesce(metadata->'team'->>'slug', '') = any(p_values);
    get diagnostics last_count = row_count;
    changed_count := changed_count + coalesce(last_count, 0);
  end if;

  return changed_count;
end;
$$;

grant execute on function public.sbw_admin_clear_deleted_team_from_profiles(text[]) to authenticated;

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
  next_metadata jsonb;
  match_values text[];
  related_values text[];
  deleted_members integer := 0;
  deleted_invites integer := 0;
  cleared_profiles integer := 0;
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
  match_values := array_remove(array[target_row.id::text, target_row.slug, target_row.name, target_row.tag], null);

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
      union
      select t.name as value
      from public.teams t
      where t.id = target_row.id
         or t.slug = target_row.slug
         or coalesce(t.parent_team_slug, '') = coalesce(target_row.slug, '')
      union
      select t.tag as value
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
    deleted_invites := deleted_invites + public.sbw_admin_delete_rows_by_text_match('team_invites', 'team_name', related_values);
    deleted_members := deleted_members + public.sbw_admin_delete_rows_by_text_match('team_members', 'team_id', related_values);
    deleted_members := deleted_members + public.sbw_admin_delete_rows_by_text_match('team_members', 'team_slug', related_values);
    deleted_members := deleted_members + public.sbw_admin_delete_rows_by_text_match('team_members', 'team_name', related_values);

    perform public.sbw_admin_delete_rows_by_text_match('team_audit_logs', 'team_id', related_values);
    perform public.sbw_admin_delete_rows_by_text_match('team_audit_logs', 'team_slug', related_values);

    cleared_profiles := public.sbw_admin_clear_deleted_team_from_profiles(related_values);

    delete from public.teams
     where coalesce(parent_team_slug, '') = coalesce(target_row.slug, '');

    delete from public.teams
     where id = target_row.id;

    return jsonb_build_object(
      'ok', true,
      'action', 'delete',
      'message', 'Equipe excluída definitivamente do banco de dados.',
      'deletedMembers', deleted_members,
      'deletedInvites', deleted_invites,
      'clearedProfiles', cleared_profiles,
      'team', to_jsonb(target_row)
    );
  end if;

  next_metadata := coalesce(target_row.metadata, '{}'::jsonb)
    || jsonb_build_object(
      'adminLastAction', jsonb_build_object(
        'action', normalized_action,
        'previousStatus', previous_status,
        'previousVisibility', previous_visibility,
        'reason', nullif(p_reason, ''),
        'adminAuthUserId', auth.uid(),
        'at', now()
      ),
      'adminManaged', true,
      'adminArchived', true,
      'adminDeleted', false
    );

  update public.teams
     set is_public = false,
         is_verified = false,
         status = 'archived',
         metadata = next_metadata,
         updated_at = now()
   where id = target_row.id
   returning * into target_row;

  return jsonb_build_object(
    'ok', true,
    'action', 'archive',
    'message', 'Equipe arquivada e escondida da área pública e dos organizadores.',
    'team', to_jsonb(target_row)
  );
end;
$$;

grant execute on function public.sbw_admin_manage_team(text, text, text) to authenticated;

notify pgrst, 'reload schema';
