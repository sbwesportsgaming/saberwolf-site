-- -SBW- v1.6.52
-- Permissão real para criar Organização de Torneios.
-- Objetivo:
-- 1. Criar/normalizar organizer_permissions no Supabase.
-- 2. Permitir que apenas Admin Master/Admin SBW conceda ou remova a permissão.
-- 3. Separar permissão de criar Organização da permissão de criar Torneio.
-- 4. Não usar localStorage como autorização real.

-- =========================================================
-- Tabela de permissões de organizador
-- =========================================================
create table if not exists public.organizer_permissions (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null,
  profile_id uuid null,
  profile_slug text null,
  status text not null default 'pending',
  role text not null default 'organizer_creator',
  can_create_organizations boolean not null default false,
  can_create_tournaments boolean not null default false,
  granted_by_auth_user_id uuid null,
  granted_at timestamptz null,
  revoked_at timestamptz null,
  reason text null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organizer_permissions
  add column if not exists id uuid default gen_random_uuid(),
  add column if not exists auth_user_id uuid,
  add column if not exists profile_id uuid,
  add column if not exists profile_slug text,
  add column if not exists status text default 'pending',
  add column if not exists role text default 'organizer_creator',
  add column if not exists can_create_organizations boolean default false,
  add column if not exists can_create_tournaments boolean default false,
  add column if not exists granted_by_auth_user_id uuid,
  add column if not exists granted_at timestamptz,
  add column if not exists revoked_at timestamptz,
  add column if not exists reason text,
  add column if not exists metadata jsonb default '{}'::jsonb,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

update public.organizer_permissions
set
  id = coalesce(id, gen_random_uuid()),
  status = coalesce(status, 'pending'),
  role = coalesce(role, 'organizer_creator'),
  can_create_organizations = coalesce(can_create_organizations, false),
  can_create_tournaments = coalesce(can_create_tournaments, false),
  metadata = coalesce(metadata, '{}'::jsonb),
  created_at = coalesce(created_at, now()),
  updated_at = coalesce(updated_at, now());

-- Remove duplicidades antigas por auth_user_id, mantendo a linha mais recente.
with ranked as (
  select
    id,
    auth_user_id,
    row_number() over (
      partition by auth_user_id
      order by coalesce(updated_at, created_at, now()) desc, id desc
    ) as rn
  from public.organizer_permissions
  where auth_user_id is not null
)
delete from public.organizer_permissions op
using ranked r
where op.id = r.id
  and r.rn > 1;

create unique index if not exists organizer_permissions_auth_user_id_key
  on public.organizer_permissions(auth_user_id);

create index if not exists organizer_permissions_status_idx
  on public.organizer_permissions(status);

create index if not exists organizer_permissions_profile_slug_idx
  on public.organizer_permissions(profile_slug);

-- =========================================================
-- Helper: Admin Master/Admin SBW
-- =========================================================
drop function if exists public.sbw_is_platform_admin();

create or replace function public.sbw_is_platform_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  profile_row jsonb;
  permission_row jsonb;
  current_profile_id text := '';
  current_profile_slug text := '';
  current_email text := '';
begin
  if auth.uid() is null then
    return false;
  end if;

  select to_jsonb(p)
    into profile_row
  from public.profiles p
  where p.auth_user_id = auth.uid()
     or p.id::text = auth.uid()::text
  limit 1;

  if profile_row is not null then
    current_profile_id := coalesce(profile_row->>'id', '');
    current_profile_slug := coalesce(profile_row->>'slug', profile_row->>'username', '');
    current_email := coalesce(profile_row->>'email', profile_row->>'auth_email', '');

    if coalesce((profile_row->'permissions'->>'isMasterAdmin')::boolean, false)
       or coalesce((profile_row->'permissions'->>'is_master_admin')::boolean, false)
       or coalesce((profile_row->'permissions'->>'isAdminSbw')::boolean, false)
       or coalesce((profile_row->'permissions'->>'is_admin_sbw')::boolean, false)
       or coalesce((profile_row->'permissions'->>'canManagePermissions')::boolean, false)
       or coalesce((profile_row->'permissions'->>'can_manage_permissions')::boolean, false)
       or coalesce((profile_row->'metadata'->'permissions'->>'isMasterAdmin')::boolean, false)
       or coalesce((profile_row->'metadata'->'permissions'->>'is_master_admin')::boolean, false)
       or coalesce((profile_row->'metadata'->'permissions'->>'isAdminSbw')::boolean, false)
       or coalesce((profile_row->'metadata'->'permissions'->>'is_admin_sbw')::boolean, false)
       or coalesce((profile_row->'metadata'->'permissions'->>'canManagePermissions')::boolean, false)
       or coalesce((profile_row->'metadata'->'permissions'->>'can_manage_permissions')::boolean, false)
    then
      return true;
    end if;
  end if;

  if to_regclass('public.site_permissions') is not null then
    for permission_row in execute 'select to_jsonb(sp) from public.site_permissions sp' loop
      if lower(coalesce(permission_row->>'status', permission_row->>'state', 'active')) in ('inactive', 'disabled', 'revoked', 'rejected', 'denied', 'blocked') then
        continue;
      end if;

      if coalesce(permission_row->>'auth_user_id', permission_row->>'user_id', '') not in ('', auth.uid()::text)
         and coalesce(permission_row->>'profile_id', '') not in ('', current_profile_id)
         and coalesce(permission_row->>'profile_slug', permission_row->>'slug', '') not in ('', current_profile_slug)
         and coalesce(permission_row->>'email', permission_row->>'user_email', '') not in ('', current_email)
      then
        continue;
      end if;

      if lower(coalesce(permission_row->>'permission_key', permission_row->>'permission', permission_row->>'role', permission_row->>'type', '')) in (
        'master',
        'master_admin',
        'admin',
        'admin_sbw',
        'site_admin',
        'permission_admin',
        'permissions_admin',
        'can_manage_permissions'
      )
      or coalesce((permission_row->>'isMasterAdmin')::boolean, false)
      or coalesce((permission_row->>'is_master_admin')::boolean, false)
      or coalesce((permission_row->>'isAdminSbw')::boolean, false)
      or coalesce((permission_row->>'is_admin_sbw')::boolean, false)
      or coalesce((permission_row->>'canManagePermissions')::boolean, false)
      or coalesce((permission_row->>'can_manage_permissions')::boolean, false)
      then
        return true;
      end if;
    end loop;
  end if;

  return false;
end;
$$;

grant execute on function public.sbw_is_platform_admin() to authenticated;

-- =========================================================
-- RLS
-- =========================================================
alter table public.organizer_permissions enable row level security;

drop policy if exists organizer_permissions_select_own_or_admin on public.organizer_permissions;
drop policy if exists organizer_permissions_admin_insert on public.organizer_permissions;
drop policy if exists organizer_permissions_admin_update on public.organizer_permissions;
drop policy if exists organizer_permissions_admin_delete on public.organizer_permissions;

create policy organizer_permissions_select_own_or_admin
on public.organizer_permissions
for select
using (
  auth_user_id = auth.uid()
  or public.sbw_is_platform_admin()
);

create policy organizer_permissions_admin_insert
on public.organizer_permissions
for insert
with check (public.sbw_is_platform_admin());

create policy organizer_permissions_admin_update
on public.organizer_permissions
for update
using (public.sbw_is_platform_admin())
with check (public.sbw_is_platform_admin());

create policy organizer_permissions_admin_delete
on public.organizer_permissions
for delete
using (public.sbw_is_platform_admin());

-- =========================================================
-- RPC: Minha permissão
-- =========================================================
drop function if exists public.sbw_get_my_organizer_permission();

create or replace function public.sbw_get_my_organizer_permission()
returns public.organizer_permissions
language plpgsql
security definer
set search_path = public
as $$
declare
  result_row public.organizer_permissions;
begin
  if auth.uid() is null then
    return null;
  end if;

  select *
    into result_row
  from public.organizer_permissions op
  where op.auth_user_id = auth.uid()
  limit 1;

  return result_row;
end;
$$;

grant execute on function public.sbw_get_my_organizer_permission() to authenticated;

-- =========================================================
-- RPC: Admin lista permissões
-- =========================================================
drop function if exists public.sbw_admin_list_organizer_permissions();

create or replace function public.sbw_admin_list_organizer_permissions()
returns setof public.organizer_permissions
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.sbw_is_platform_admin() then
    raise exception 'Apenas Admin Master/Admin SBW pode listar permissões de organização.';
  end if;

  return query
  select *
  from public.organizer_permissions op
  order by coalesce(op.updated_at, op.created_at, now()) desc;
end;
$$;

grant execute on function public.sbw_admin_list_organizer_permissions() to authenticated;

-- =========================================================
-- RPC: Admin concede permissão para criar Organização
-- =========================================================
drop function if exists public.sbw_admin_set_organizer_permission(uuid, uuid, text, text);

create or replace function public.sbw_admin_set_organizer_permission(
  p_target_auth_user_id uuid,
  p_target_profile_id uuid default null,
  p_target_profile_slug text default '',
  p_reason text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  saved_row public.organizer_permissions;
  target_profile public.profiles;
begin
  if not public.sbw_is_platform_admin() then
    raise exception 'Apenas Admin Master/Admin SBW pode conceder permissão de organização.';
  end if;

  if p_target_auth_user_id is null then
    raise exception 'Usuário alvo inválido.';
  end if;

  select *
    into target_profile
  from public.profiles p
  where p.auth_user_id = p_target_auth_user_id
     or p.id = p_target_profile_id
     or p.slug = nullif(p_target_profile_slug, '')
     or p.username = nullif(p_target_profile_slug, '')
  limit 1;

  insert into public.organizer_permissions (
    auth_user_id,
    profile_id,
    profile_slug,
    status,
    role,
    can_create_organizations,
    can_create_tournaments,
    granted_by_auth_user_id,
    granted_at,
    revoked_at,
    reason,
    metadata,
    created_at,
    updated_at
  ) values (
    p_target_auth_user_id,
    coalesce(p_target_profile_id, target_profile.id),
    coalesce(nullif(p_target_profile_slug, ''), target_profile.slug, target_profile.username),
    'approved',
    'organizer_creator',
    true,
    false,
    auth.uid(),
    now(),
    null,
    nullif(p_reason, ''),
    jsonb_build_object(
      'source', 'admin-v1.6.52',
      'scope', 'create_tournament_organization',
      'note', 'Permissão para criar organização; não concede criação de torneio ainda.'
    ),
    now(),
    now()
  )
  on conflict (auth_user_id)
  do update set
    profile_id = coalesce(excluded.profile_id, public.organizer_permissions.profile_id),
    profile_slug = coalesce(excluded.profile_slug, public.organizer_permissions.profile_slug),
    status = 'approved',
    role = 'organizer_creator',
    can_create_organizations = true,
    can_create_tournaments = false,
    granted_by_auth_user_id = auth.uid(),
    granted_at = now(),
    revoked_at = null,
    reason = nullif(p_reason, ''),
    metadata = coalesce(public.organizer_permissions.metadata, '{}'::jsonb) || excluded.metadata,
    updated_at = now()
  returning * into saved_row;

  return jsonb_build_object(
    'ok', true,
    'status', saved_row.status,
    'authUserId', saved_row.auth_user_id,
    'canCreateOrganizations', saved_row.can_create_organizations,
    'canCreateTournaments', saved_row.can_create_tournaments,
    'message', 'Permissão para criar Organização de Torneios concedida.'
  );
end;
$$;

grant execute on function public.sbw_admin_set_organizer_permission(uuid, uuid, text, text) to authenticated;

-- =========================================================
-- RPC: Admin remove permissão
-- =========================================================
drop function if exists public.sbw_admin_revoke_organizer_permission(uuid, text);

create or replace function public.sbw_admin_revoke_organizer_permission(
  p_target_auth_user_id uuid,
  p_reason text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  saved_row public.organizer_permissions;
begin
  if not public.sbw_is_platform_admin() then
    raise exception 'Apenas Admin Master/Admin SBW pode remover permissão de organização.';
  end if;

  if p_target_auth_user_id is null then
    raise exception 'Usuário alvo inválido.';
  end if;

  update public.organizer_permissions
  set
    status = 'revoked',
    can_create_organizations = false,
    can_create_tournaments = false,
    revoked_at = now(),
    reason = nullif(p_reason, ''),
    metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
      'revokedByAuthUserId', auth.uid(),
      'revokedAt', now(),
      'source', 'admin-v1.6.52'
    ),
    updated_at = now()
  where auth_user_id = p_target_auth_user_id
  returning * into saved_row;

  if saved_row.auth_user_id is null then
    raise exception 'Permissão de organização não encontrada para este usuário.';
  end if;

  return jsonb_build_object(
    'ok', true,
    'status', saved_row.status,
    'authUserId', saved_row.auth_user_id,
    'message', 'Permissão de Organização de Torneios removida.'
  );
end;
$$;

grant execute on function public.sbw_admin_revoke_organizer_permission(uuid, text) to authenticated;
