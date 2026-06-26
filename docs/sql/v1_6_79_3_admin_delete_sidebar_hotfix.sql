-- =========================================================
-- v1.6.79.3 — Hotfix Admin Master: exclusões seguras e sidebar
-- Plataforma -SBW-
-- =========================================================
-- Reaplica as RPCs administrativas com soft delete conservador.
-- Torneios: status arquivado + privado + metadata.adminDeleted=true.
-- Equipes: inativa + privada + sem verificação + metadata.adminDeleted=true.
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

-- ---------------------------------------------------------
-- Torneios globais do Admin Master
-- ---------------------------------------------------------
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
  elsif normalized_action = 'delete' then
    -- Conservador para evitar constraints de status: exclusão administrativa = arquivado privado + metadata.adminDeleted.
    next_status := 'archived';
    next_visibility := 'private';
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
      'adminDeleted', normalized_action = 'delete'
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
      when 'archive' then 'Torneio arquivado.'
      when 'delete' then 'Torneio excluído do painel com segurança.'
      when 'restore' then 'Torneio restaurado.'
      else 'Ação administrativa concluída.'
    end,
    'tournament', to_jsonb(target_row)
  );
end;
$$;

grant execute on function public.sbw_admin_manage_tournament(text, text, text) to authenticated;

-- ---------------------------------------------------------
-- Equipes globais do Admin Master
-- ---------------------------------------------------------
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
begin
  if not public.sbw_admin_panel_can_manage() then
    raise exception 'Apenas Admin Master/Admin SBW pode executar ações administrativas em equipes.';
  end if;

  if nullif(trim(coalesce(p_team, '')), '') is null then
    raise exception 'Equipe não informada.';
  end if;

  if normalized_action not in ('delete') then
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
      'adminDeleted', true
    );

  update public.teams
     set is_active = false,
         is_public = false,
         is_verified = false,
         verification_status = 'not_verified',
         member_limit = 50,
         status = 'inactive',
         metadata = next_metadata,
         updated_at = now()
   where id = target_row.id
   returning * into target_row;

  return jsonb_build_object(
    'ok', true,
    'action', normalized_action,
    'message', 'Equipe excluída do painel com segurança.',
    'team', to_jsonb(target_row)
  );
end;
$$;

grant execute on function public.sbw_admin_manage_team(text, text, text) to authenticated;

notify pgrst, 'reload schema';
