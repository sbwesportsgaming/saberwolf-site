-- -SBW- v1.6.43
-- Transferências + Convites de Equipe
-- Cria RPCs seguras para:
-- 1) enviar convite de equipe;
-- 2) listar convites recebidos pelo usuário logado;
-- 3) aceitar convite e criar vínculo real em team_members;
-- 4) recusar convite.

-- Lista convites recebidos do usuário autenticado, evitando depender de SELECT direto bloqueado por RLS.
drop function if exists public.sbw_get_current_user_team_invites();

create or replace function public.sbw_get_current_user_team_invites()
returns setof public.team_invites
language plpgsql
security definer
set search_path = public
as $$
declare
  current_profile public.profiles;
  identifiers text[];
begin
  if auth.uid() is null then
    return;
  end if;

  select *
    into current_profile
  from public.profiles p
  where p.auth_user_id::text = auth.uid()::text
     or p.id::text = auth.uid()::text
  limit 1;

  identifiers := array_remove(array[
    auth.uid()::text,
    current_profile.id::text,
    current_profile.slug,
    current_profile.username
  ], null);

  return query
  select ti.*
  from public.team_invites ti
  where ti.invited_profile_slug = any(identifiers)
  order by ti.created_at desc;
end;
$$;

grant execute on function public.sbw_get_current_user_team_invites() to authenticated;

-- Envia convite de equipe por RPC, validando que o usuário pode gerenciar a equipe.
drop function if exists public.sbw_create_team_invite(text, text, text, text, text, text, jsonb);

create or replace function public.sbw_create_team_invite(
  p_team_key text,
  p_invited_profile_slug text,
  p_role text default 'member',
  p_function_name text default 'Player',
  p_public_title text default '',
  p_message text default '',
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  target_team public.teams;
  target_profile public.profiles;
  inviter_profile public.profiles;
  existing_invite public.team_invites;
  created_invite public.team_invites;
  target_profile_key text;
  inviter_profile_key text;
  now_value timestamptz := now();
begin
  if auth.uid() is null then
    raise exception 'Entre na sua conta para enviar convites.';
  end if;

  select *
    into target_team
  from public.teams t
  where t.slug = p_team_key
     or t.id::text = p_team_key
  limit 1;

  if target_team.id is null then
    raise exception 'Equipe não encontrada.';
  end if;

  if not public.sbw_can_manage_team_assets(target_team.slug) then
    raise exception 'Você não tem permissão para convidar jogadores para esta equipe.';
  end if;

  select *
    into inviter_profile
  from public.profiles p
  where p.auth_user_id::text = auth.uid()::text
     or p.id::text = auth.uid()::text
  limit 1;

  inviter_profile_key := coalesce(inviter_profile.slug, inviter_profile.username, inviter_profile.id::text, auth.uid()::text);

  select *
    into target_profile
  from public.profiles p
  where p.slug = p_invited_profile_slug
     or p.username = p_invited_profile_slug
     or p.id::text = p_invited_profile_slug
     or p.auth_user_id::text = p_invited_profile_slug
  limit 1;

  if target_profile.id is null then
    raise exception 'Perfil convidado não encontrado.';
  end if;

  target_profile_key := coalesce(target_profile.slug, target_profile.username, target_profile.id::text, p_invited_profile_slug);

  if exists (
    select 1
    from public.team_members tm
    where lower(coalesce(tm.status, 'active')) in ('active', 'ativo', 'accepted', 'confirmed')
      and (
        tm.profile_slug = target_profile_key
        or tm.profile_slug = target_profile.slug
        or tm.profile_slug = target_profile.username
        or tm.profile_slug = target_profile.id::text
        or tm.auth_user_id::text = target_profile.auth_user_id::text
      )
  ) then
    raise exception 'Este usuário já participa de uma equipe ativa.';
  end if;

  select *
    into existing_invite
  from public.team_invites ti
  where ti.team_slug = target_team.slug
    and lower(coalesce(ti.status, 'pending')) = 'pending'
    and (
      ti.invited_profile_slug = target_profile_key
      or ti.invited_profile_slug = target_profile.slug
      or ti.invited_profile_slug = target_profile.username
      or ti.invited_profile_slug = target_profile.id::text
      or ti.invited_profile_slug = target_profile.auth_user_id::text
    )
  order by ti.created_at desc
  limit 1;

  if existing_invite.id is not null then
    return jsonb_build_object(
      'ok', true,
      'duplicate', true,
      'invite', to_jsonb(existing_invite),
      'message', 'Já existe convite pendente para esse jogador.'
    );
  end if;

  insert into public.team_invites (
    team_slug,
    invited_profile_slug,
    invited_by_profile_slug,
    role,
    function_name,
    public_title,
    status,
    message,
    invited_at,
    metadata
  ) values (
    target_team.slug,
    target_profile_key,
    inviter_profile_key,
    coalesce(nullif(trim(p_role), ''), 'member'),
    coalesce(nullif(trim(p_function_name), ''), 'Player'),
    nullif(trim(coalesce(p_public_title, '')), ''),
    'pending',
    coalesce(p_message, ''),
    now_value,
    coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object(
      'teamName', target_team.name,
      'teamTag', target_team.tag,
      'teamLogoUrl', target_team.logo_url,
      'displayName', coalesce(target_profile.display_name, target_profile.nickname, target_profile.username, target_profile.slug),
      'nickname', coalesce(target_profile.nickname, target_profile.username, target_profile.slug),
      'avatarUrl', coalesce(target_profile.avatar_url, ''),
      'createdByAuthUserId', auth.uid(),
      'createdByProfileSlug', inviter_profile_key,
      'source', 'team-admin-v1.6.43-rpc'
    )
  )
  returning * into created_invite;

  return jsonb_build_object(
    'ok', true,
    'duplicate', false,
    'invite', to_jsonb(created_invite),
    'message', 'Convite enviado.'
  );
end;
$$;

grant execute on function public.sbw_create_team_invite(text, text, text, text, text, text, jsonb) to authenticated;

-- Aceita convite recebido pelo usuário logado e cria vínculo real em team_members.
drop function if exists public.sbw_accept_team_invite(text);

create or replace function public.sbw_accept_team_invite(p_invite_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_profile public.profiles;
  target_invite public.team_invites;
  target_team public.teams;
  member_row public.team_members;
  identifiers text[];
  profile_key text;
  now_value timestamptz := now();
begin
  if auth.uid() is null then
    raise exception 'Entre na sua conta para aceitar convites.';
  end if;

  select *
    into current_profile
  from public.profiles p
  where p.auth_user_id::text = auth.uid()::text
     or p.id::text = auth.uid()::text
  limit 1;

  if current_profile.id is null then
    raise exception 'Perfil do usuário não encontrado.';
  end if;

  identifiers := array_remove(array[
    auth.uid()::text,
    current_profile.id::text,
    current_profile.slug,
    current_profile.username
  ], null);

  profile_key := coalesce(current_profile.slug, current_profile.username, current_profile.id::text);

  select *
    into target_invite
  from public.team_invites ti
  where ti.id::text = p_invite_id
  limit 1;

  if target_invite.id is null then
    raise exception 'Convite não encontrado.';
  end if;

  if not target_invite.invited_profile_slug = any(identifiers) then
    raise exception 'Este convite não pertence ao usuário logado.';
  end if;

  if lower(coalesce(target_invite.status, 'pending')) <> 'pending' then
    raise exception 'Este convite já foi respondido.';
  end if;

  select *
    into target_team
  from public.teams t
  where t.slug = target_invite.team_slug
  limit 1;

  if target_team.id is null then
    raise exception 'Equipe do convite não encontrada.';
  end if;

  if exists (
    select 1
    from public.team_members tm
    where lower(coalesce(tm.status, 'active')) in ('active', 'ativo', 'accepted', 'confirmed')
      and tm.team_slug <> target_team.slug
      and (
        tm.profile_slug = any(identifiers)
        or tm.auth_user_id::text = auth.uid()::text
      )
  ) then
    raise exception 'Você já participa de outra equipe ativa. Saia da equipe atual antes de aceitar outro convite.';
  end if;

  select *
    into member_row
  from public.team_members tm
  where tm.team_slug = target_team.slug
    and tm.profile_slug = profile_key
  limit 1;

  if member_row.team_slug is not null then
    update public.team_members tm
    set
      auth_user_id = auth.uid(),
      nickname = coalesce(current_profile.nickname, current_profile.username, current_profile.slug, profile_key),
      display_name = coalesce(current_profile.display_name, current_profile.nickname, current_profile.username, current_profile.slug, profile_key),
      avatar_url = coalesce(current_profile.avatar_url, ''),
      role = coalesce(target_invite.role, 'member'),
      function_name = coalesce(target_invite.function_name, 'Player'),
      public_title = coalesce(target_invite.public_title, ''),
      status = 'active',
      joined_at = coalesce(tm.joined_at, now_value),
      invited_by_profile_slug = target_invite.invited_by_profile_slug,
      metadata = coalesce(tm.metadata, '{}'::jsonb) || jsonb_build_object(
        'source', 'team-invite-accept-v1.6.43-rpc',
        'inviteId', target_invite.id,
        'teamName', target_team.name,
        'teamTag', target_team.tag
      ),
      updated_at = now_value
    where tm.id = member_row.id
    returning * into member_row;
  else
    insert into public.team_members (
      team_slug,
      profile_slug,
      auth_user_id,
      nickname,
      display_name,
      avatar_url,
      role,
      function_name,
      public_title,
      games,
      status,
      joined_at,
      invited_by_profile_slug,
      metadata
    ) values (
      target_team.slug,
      profile_key,
      auth.uid(),
      coalesce(current_profile.nickname, current_profile.username, current_profile.slug, profile_key),
      coalesce(current_profile.display_name, current_profile.nickname, current_profile.username, current_profile.slug, profile_key),
      coalesce(current_profile.avatar_url, ''),
      coalesce(target_invite.role, 'member'),
      coalesce(target_invite.function_name, 'Player'),
      coalesce(target_invite.public_title, ''),
      '[]'::jsonb,
      'active',
      now_value,
      target_invite.invited_by_profile_slug,
      jsonb_build_object(
        'source', 'team-invite-accept-v1.6.43-rpc',
        'inviteId', target_invite.id,
        'teamName', target_team.name,
        'teamTag', target_team.tag
      )
    )
    returning * into member_row;
  end if;

  update public.team_invites
  set
    status = 'accepted',
    responded_at = now_value,
    updated_at = now_value
  where id = target_invite.id;

  update public.profiles
  set
    current_team_id = target_team.id,
    current_team_name = target_team.name,
    current_team_slug = target_team.slug,
    updated_at = now_value
  where id = current_profile.id;

  return jsonb_build_object(
    'ok', true,
    'status', 'accepted',
    'inviteId', target_invite.id,
    'teamSlug', target_team.slug,
    'teamName', target_team.name,
    'member', to_jsonb(member_row),
    'message', 'Convite aceito. Você entrou na equipe.'
  );
end;
$$;

grant execute on function public.sbw_accept_team_invite(text) to authenticated;

-- Recusa convite recebido pelo usuário logado.
drop function if exists public.sbw_decline_team_invite(text);

create or replace function public.sbw_decline_team_invite(p_invite_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_profile public.profiles;
  target_invite public.team_invites;
  identifiers text[];
  now_value timestamptz := now();
begin
  if auth.uid() is null then
    raise exception 'Entre na sua conta para recusar convites.';
  end if;

  select *
    into current_profile
  from public.profiles p
  where p.auth_user_id::text = auth.uid()::text
     or p.id::text = auth.uid()::text
  limit 1;

  if current_profile.id is null then
    raise exception 'Perfil do usuário não encontrado.';
  end if;

  identifiers := array_remove(array[
    auth.uid()::text,
    current_profile.id::text,
    current_profile.slug,
    current_profile.username
  ], null);

  select *
    into target_invite
  from public.team_invites ti
  where ti.id::text = p_invite_id
  limit 1;

  if target_invite.id is null then
    raise exception 'Convite não encontrado.';
  end if;

  if not target_invite.invited_profile_slug = any(identifiers) then
    raise exception 'Este convite não pertence ao usuário logado.';
  end if;

  if lower(coalesce(target_invite.status, 'pending')) <> 'pending' then
    return jsonb_build_object(
      'ok', true,
      'status', target_invite.status,
      'inviteId', target_invite.id,
      'message', 'Este convite já foi respondido.'
    );
  end if;

  update public.team_invites
  set
    status = 'declined',
    responded_at = now_value,
    updated_at = now_value
  where id = target_invite.id;

  return jsonb_build_object(
    'ok', true,
    'status', 'declined',
    'inviteId', target_invite.id,
    'message', 'Convite recusado.'
  );
end;
$$;

grant execute on function public.sbw_decline_team_invite(text) to authenticated;
