-- -SBW- v1.6.54
-- Organizadores: navegação, seção Admin e correção de remoção de permissão.
-- Objetivo:
-- 1. Tornar a RPC de remoção mais tolerante: por id da permissão, auth_user_id, profile_id ou profile_slug.
-- 2. Evitar que a remoção falhe quando o card do Admin não tem auth_user_id direto no perfil.
-- 3. Manter a regra: apenas Admin Master/Admin SBW remove permissão.
-- 4. Não remover organizações já criadas; apenas revogar a porta de criação de organização.

-- Remove assinatura antiga da v1.6.52, se existir.
drop function if exists public.sbw_admin_revoke_organizer_permission(uuid, text);

-- Remove assinatura nova, se já tiver sido criada em teste.
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
declare
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
      p_permission_id is not null
      and op.id = p_permission_id
    )
    or (
      p_target_auth_user_id is not null
      and op.auth_user_id = p_target_auth_user_id
    )
    or (
      p_target_profile_id is not null
      and op.profile_id = p_target_profile_id
    )
    or (
      nullif(trim(p_target_profile_slug), '') is not null
      and lower(coalesce(op.profile_slug, '')) = lower(trim(p_target_profile_slug))
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
      'source', 'admin-v1.6.54',
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

grant execute on function public.sbw_admin_revoke_organizer_permission(uuid, uuid, uuid, text, text) to authenticated;
