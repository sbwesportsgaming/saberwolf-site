-- -SBW- v1.6.54.2
-- Hotfix: Remover permissão de organizador sem ambiguidade de RPC e com reload de schema cache.
-- Contexto:
-- O Admin estava chamando /rpc/sbw_admin_revoke_organizer_permission_v2 e recebendo 404.
-- Isso significa que a função não existe no schema exposto pelo PostgREST/Supabase ou o cache de schema não atualizou.
-- Esta versão cria uma RPC única com argumento JSONB, evitando conflito de assinatura/overload.

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

create unique index if not exists organizer_permissions_auth_user_id_key
  on public.organizer_permissions(auth_user_id)
  where auth_user_id is not null;

create index if not exists organizer_permissions_status_idx
  on public.organizer_permissions(status);

create index if not exists organizer_permissions_profile_slug_idx
  on public.organizer_permissions(profile_slug);

-- Função sem overload: 1 único parâmetro jsonb.
-- Chamada esperada no JS:
-- rpc('sbw_admin_revoke_organizer_permission_json', { p_payload: {...} })
drop function if exists public.sbw_admin_revoke_organizer_permission_json(jsonb);

create or replace function public.sbw_admin_revoke_organizer_permission_json(
  p_payload jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  permission_id_text text := coalesce(p_payload->>'permissionId', p_payload->>'permission_id', p_payload->>'id', '');
  auth_user_id_text text := coalesce(p_payload->>'authUserId', p_payload->>'auth_user_id', p_payload->>'userId', p_payload->>'user_id', '');
  profile_id_text text := coalesce(p_payload->>'profileId', p_payload->>'profile_id', '');
  profile_slug_text text := lower(trim(coalesce(p_payload->>'profileSlug', p_payload->>'profile_slug', p_payload->>'slug', p_payload->>'username', '')));
  revoke_reason text := coalesce(nullif(p_payload->>'reason', ''), 'Permissão removida pelo Admin Master -SBW-');
  uuid_pattern text := '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';
  target_permission_id uuid;
  saved_row public.organizer_permissions;
begin
  if not public.sbw_is_platform_admin() then
    raise exception 'Apenas Admin Master/Admin SBW pode remover permissão de organização.';
  end if;

  select op.id
    into target_permission_id
  from public.organizer_permissions op
  where (
      permission_id_text ~* uuid_pattern
      and op.id = permission_id_text::uuid
    )
    or (
      auth_user_id_text ~* uuid_pattern
      and op.auth_user_id = auth_user_id_text::uuid
    )
    or (
      profile_id_text ~* uuid_pattern
      and op.profile_id = profile_id_text::uuid
    )
    or (
      profile_slug_text <> ''
      and lower(coalesce(op.profile_slug, '')) = profile_slug_text
    )
    or (
      profile_slug_text <> ''
      and exists (
        select 1
        from public.profiles p
        where (
          lower(coalesce(p.slug, '')) = profile_slug_text
          or lower(coalesce(p.username, '')) = profile_slug_text
          or lower(coalesce(p.email, '')) = profile_slug_text
          or p.id::text = profile_slug_text
          or p.auth_user_id::text = profile_slug_text
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
      'message', 'Permissão de organização não encontrada para este usuário.',
      'debug', jsonb_build_object(
        'permissionId', permission_id_text,
        'authUserId', auth_user_id_text,
        'profileId', profile_id_text,
        'profileSlug', profile_slug_text
      )
    );
  end if;

  update public.organizer_permissions
  set
    status = 'revoked',
    can_create_organizations = false,
    can_create_tournaments = false,
    revoked_at = now(),
    reason = revoke_reason,
    metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
      'revokedByAuthUserId', auth.uid(),
      'revokedAt', now(),
      'source', 'admin-v1.6.54.2',
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

grant execute on function public.sbw_admin_revoke_organizer_permission_json(jsonb) to authenticated;

-- Mantém compatibilidade com chamadas anteriores, mas redireciona para a função JSON.
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
begin
  return public.sbw_admin_revoke_organizer_permission_json(
    jsonb_build_object(
      'permissionId', coalesce(p_permission_id, ''),
      'authUserId', coalesce(p_target_auth_user_id, ''),
      'profileId', coalesce(p_target_profile_id, ''),
      'profileSlug', coalesce(p_target_profile_slug, ''),
      'reason', coalesce(p_reason, '')
    )
  );
end;
$$;

grant execute on function public.sbw_admin_revoke_organizer_permission_v2(text, text, text, text, text) to authenticated;

-- Força recarregamento do schema cache do PostgREST/Supabase.
notify pgrst, 'reload schema';
