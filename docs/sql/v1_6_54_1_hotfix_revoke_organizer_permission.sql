-- -SBW- v1.6.54.1
-- Hotfix: remover permissão de criação de Organização de Torneios.
-- Objetivo:
-- 1. Criar uma RPC v2 sem ambiguidade de assinatura para o Admin remover permissões.
-- 2. Aceitar permission_id, auth_user_id, profile_id ou profile_slug como texto.
-- 3. Evitar falha quando o card do Admin não tiver auth_user_id direto.
-- 4. Manter a regra: apenas Admin Master/Admin SBW pode remover permissão.
-- 5. Não apagar organizações já criadas; apenas revogar a porta de criação de organização.

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

create unique index if not exists organizer_permissions_auth_user_id_key
  on public.organizer_permissions(auth_user_id)
  where auth_user_id is not null;

create index if not exists organizer_permissions_status_idx
  on public.organizer_permissions(status);

create index if not exists organizer_permissions_profile_slug_idx
  on public.organizer_permissions(profile_slug);

-- RPC principal do hotfix, com parâmetros text para evitar erro de UUID inválido no PostgREST.
drop function if exists public.sbw_admin_revoke_organizer_permission_v2(text, text, text, text, text);

create or replace function public.sbw_admin_revoke_organizer_permission_v2(
  p_permission_id text default '',
  p_target_auth_user_id text default '',
  p_target_profile_id text default '',
  p_target_profile_slug text default '',
  p_reason text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  target_permission_id uuid;
  target_slug text := lower(trim(coalesce(p_target_profile_slug, '')));
  saved_row public.organizer_permissions;
  uuid_pattern text := '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';
begin
  if not public.sbw_is_platform_admin() then
    raise exception 'Apenas Admin Master/Admin SBW pode remover permissão de organização.';
  end if;

  select op.id
    into target_permission_id
  from public.organizer_permissions op
  where (
      coalesce(p_permission_id, '') ~* uuid_pattern
      and op.id = p_permission_id::uuid
    )
    or (
      coalesce(p_target_auth_user_id, '') ~* uuid_pattern
      and op.auth_user_id = p_target_auth_user_id::uuid
    )
    or (
      coalesce(p_target_profile_id, '') ~* uuid_pattern
      and op.profile_id = p_target_profile_id::uuid
    )
    or (
      target_slug <> ''
      and lower(coalesce(op.profile_slug, '')) = target_slug
    )
    or (
      target_slug <> ''
      and exists (
        select 1
        from public.profiles p
        where (
          lower(coalesce(p.slug, '')) = target_slug
          or lower(coalesce(p.username, '')) = target_slug
          or lower(coalesce(p.email, '')) = target_slug
          or p.id::text = p_target_profile_slug
          or p.auth_user_id::text = p_target_profile_slug
        )
        and (
          op.profile_id = p.id
          or op.auth_user_id = p.auth_user_id
          or lower(coalesce(op.profile_slug, '')) = lower(coalesce(p.slug, ''))
          or lower(coalesce(op.profile_slug, '')) = lower(coalesce(p.username, ''))
        )
      )
    )
  order by coalesce(op.updated_at, op.created_at, now()) desc
  limit 1;

  if target_permission_id is null then
    return jsonb_build_object(
      'ok', false,
      'status', 'not_found',
      'message', 'Permissão de organização não encontrada para este usuário.'
    );
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
      'source', 'admin-v1.6.54.1',
      'note', 'Permissão de criar Organização de Torneios removida; organizações já criadas não são apagadas.'
    ),
    updated_at = now()
  where id = target_permission_id
  returning * into saved_row;

  return jsonb_build_object(
    'ok', true,
    'status', saved_row.status,
    'permissionId', saved_row.id,
    'authUserId', saved_row.auth_user_id,
    'profileId', saved_row.profile_id,
    'profileSlug', saved_row.profile_slug,
    'canCreateOrganizations', saved_row.can_create_organizations,
    'canCreateTournaments', saved_row.can_create_tournaments,
    'message', 'Permissão de Organização de Torneios removida.'
  );
end;
$$;

grant execute on function public.sbw_admin_revoke_organizer_permission_v2(text, text, text, text, text) to authenticated;

-- Compatibilidade com a assinatura v1.6.52, caso alguma parte antiga ainda chame a RPC antiga.
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
begin
  return public.sbw_admin_revoke_organizer_permission_v2(
    '',
    coalesce(p_target_auth_user_id::text, ''),
    '',
    '',
    coalesce(p_reason, '')
  );
end;
$$;

grant execute on function public.sbw_admin_revoke_organizer_permission(uuid, text) to authenticated;

-- Compatibilidade com a assinatura v1.6.54, se o JS estiver nessa versão.
drop function if exists public.sbw_admin_revoke_organizer_permission(uuid, uuid, uuid, text, text);

create or replace function public.sbw_admin_revoke_organizer_permission(
  p_permission_id uuid default null,
  p_target_auth_user_id uuid default null,
  p_target_profile_id uuid default null,
  p_target_profile_slug text default '',
  p_reason text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  return public.sbw_admin_revoke_organizer_permission_v2(
    coalesce(p_permission_id::text, ''),
    coalesce(p_target_auth_user_id::text, ''),
    coalesce(p_target_profile_id::text, ''),
    coalesce(p_target_profile_slug, ''),
    coalesce(p_reason, '')
  );
end;
$$;

grant execute on function public.sbw_admin_revoke_organizer_permission(uuid, uuid, uuid, text, text) to authenticated;
