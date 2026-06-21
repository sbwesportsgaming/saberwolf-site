-- -SBW- v1.6.60
-- Staff real do Organizador de Torneios.
-- Permite listar, adicionar, alterar cargo e remover membros do staff da organização.

alter table public.tournament_organizer_members
  add column if not exists permissions jsonb default '{}'::jsonb,
  add column if not exists metadata jsonb default '{}'::jsonb,
  add column if not exists invited_by_auth_user_id uuid,
  add column if not exists joined_at timestamptz,
  add column if not exists updated_at timestamptz default now();

create unique index if not exists tournament_organizer_members_org_auth_key
  on public.tournament_organizer_members(organizer_id, auth_user_id)
  where organizer_id is not null and auth_user_id is not null;

create index if not exists tournament_organizer_members_profile_slug_idx
  on public.tournament_organizer_members(profile_slug);

create or replace function public.sbw_get_tournament_organizer_staff(
  p_organizer text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  organizer_key text := nullif(trim(coalesce(p_organizer, '')), '');
  target_organizer public.tournament_organizers;
  staff_rows jsonb := '[]'::jsonb;
begin
  if auth.uid() is null then
    raise exception 'Entre na sua conta para ver o staff do Organizador.';
  end if;

  if organizer_key is null then
    raise exception 'Organizador não informado.';
  end if;

  select *
    into target_organizer
  from public.tournament_organizers o
  where o.id::text = organizer_key
     or o.slug = organizer_key
  limit 1;

  if target_organizer.id is null then
    raise exception 'Organização de Torneios não encontrada.';
  end if;

  if not public.sbw_can_manage_tournament_organizer(coalesce(target_organizer.slug, target_organizer.id::text)) then
    raise exception 'Você não tem permissão para ver o staff desta Organização de Torneios.';
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', m.id,
        'organizer_id', m.organizer_id,
        'organizer_slug', coalesce(m.organizer_slug, target_organizer.slug),
        'auth_user_id', m.auth_user_id,
        'profile_id', m.profile_id,
        'profile_slug', coalesce(m.profile_slug, p.slug, p.username, m.auth_user_id::text),
        'display_name', coalesce(m.display_name, p.display_name, p.nickname, p.username, p.slug, 'Membro autorizado'),
        'avatar_url', coalesce(m.avatar_url, p.avatar_url, ''),
        'role', coalesce(m.role, 'staff'),
        'status', coalesce(m.status, 'active'),
        'joined_at', m.joined_at,
        'metadata', coalesce(m.metadata, '{}'::jsonb)
      )
      order by
        case lower(coalesce(m.role, 'staff'))
          when 'owner' then 1
          when 'admin' then 2
          when 'organizer_admin' then 2
          when 'manager' then 3
          when 'tournament_admin' then 3
          else 4
        end,
        coalesce(m.display_name, p.display_name, p.nickname, p.username, p.slug, '') asc
    ),
    '[]'::jsonb
  )
  into staff_rows
  from public.tournament_organizer_members m
  left join public.profiles p
    on p.id = m.profile_id
    or p.auth_user_id = m.auth_user_id
    or p.slug = m.profile_slug
    or p.username = m.profile_slug
  where (
      m.organizer_id = target_organizer.id
      or m.organizer_slug = target_organizer.slug
    )
    and lower(coalesce(m.status, 'active')) in ('active', 'accepted', 'confirmed');

  return jsonb_build_object(
    'ok', true,
    'organizerId', target_organizer.id,
    'organizerSlug', target_organizer.slug,
    'staff', staff_rows
  );
end;
$$;

grant execute on function public.sbw_get_tournament_organizer_staff(text) to authenticated;

create or replace function public.sbw_add_tournament_organizer_staff(
  p_organizer text,
  p_profile_key text,
  p_role text default 'staff'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  organizer_key text := nullif(trim(coalesce(p_organizer, '')), '');
  profile_key text := nullif(trim(regexp_replace(coalesce(p_profile_key, ''), '^@', '')), '');
  requested_role text := lower(trim(coalesce(p_role, 'staff')));
  target_organizer public.tournament_organizers;
  target_profile public.profiles;
  saved_member public.tournament_organizer_members;
  permissions_payload jsonb := '{}'::jsonb;
begin
  if auth.uid() is null then
    raise exception 'Entre na sua conta para adicionar staff.';
  end if;

  if organizer_key is null then
    raise exception 'Organizador não informado.';
  end if;

  if profile_key is null then
    raise exception 'Informe o slug, username ou ID do perfil SBW.';
  end if;

  if requested_role not in ('admin', 'manager', 'staff') then
    requested_role := 'staff';
  end if;

  select *
    into target_organizer
  from public.tournament_organizers o
  where o.id::text = organizer_key
     or o.slug = organizer_key
  limit 1;

  if target_organizer.id is null then
    raise exception 'Organização de Torneios não encontrada.';
  end if;

  if not public.sbw_can_manage_tournament_organizer(coalesce(target_organizer.slug, target_organizer.id::text)) then
    raise exception 'Você não tem permissão para adicionar staff nesta Organização de Torneios.';
  end if;

  select *
    into target_profile
  from public.profiles p
  where p.slug = profile_key
     or p.username = profile_key
     or p.id::text = profile_key
     or p.auth_user_id::text = profile_key
  limit 1;

  if target_profile.id is null or target_profile.auth_user_id is null then
    raise exception 'Perfil SBW não encontrado ou ainda sem auth_user_id.';
  end if;

  if target_profile.auth_user_id = target_organizer.owner_auth_user_id then
    requested_role := 'owner';
  end if;

  permissions_payload := jsonb_build_object(
    'canManageOrganizer', requested_role in ('owner', 'admin'),
    'canEditProfile', requested_role in ('owner', 'admin', 'manager'),
    'canManageStaff', requested_role in ('owner', 'admin'),
    'canCreateTournaments', requested_role in ('owner', 'admin', 'manager', 'staff'),
    'canManageTournaments', requested_role in ('owner', 'admin', 'manager', 'staff'),
    'canManageSeasons', requested_role in ('owner', 'admin', 'manager'),
    'canManageRankings', requested_role in ('owner', 'admin', 'manager'),
    'canManageSettings', requested_role in ('owner', 'admin')
  );

  insert into public.tournament_organizer_members (
    organizer_id,
    organizer_slug,
    auth_user_id,
    profile_id,
    profile_slug,
    display_name,
    avatar_url,
    role,
    status,
    permissions,
    invited_by_auth_user_id,
    joined_at,
    metadata,
    created_at,
    updated_at
  ) values (
    target_organizer.id,
    target_organizer.slug,
    target_profile.auth_user_id,
    target_profile.id,
    coalesce(target_profile.slug, target_profile.username, target_profile.id::text),
    coalesce(target_profile.display_name, target_profile.nickname, target_profile.username, target_profile.slug, 'Membro autorizado'),
    coalesce(target_profile.avatar_url, ''),
    requested_role,
    'active',
    permissions_payload,
    auth.uid(),
    now(),
    jsonb_build_object(
      'source', 'organizer-staff-v1.6.60',
      'addedByAuthUserId', auth.uid(),
      'addedAt', now()
    ),
    now(),
    now()
  )
  on conflict (organizer_id, auth_user_id)
  do update set
    profile_id = excluded.profile_id,
    profile_slug = excluded.profile_slug,
    display_name = excluded.display_name,
    avatar_url = excluded.avatar_url,
    role = case
      when public.tournament_organizer_members.role = 'owner' then 'owner'
      else excluded.role
    end,
    status = 'active',
    permissions = case
      when public.tournament_organizer_members.role = 'owner' then public.tournament_organizer_members.permissions
      else excluded.permissions
    end,
    metadata = coalesce(public.tournament_organizer_members.metadata, '{}'::jsonb) || excluded.metadata,
    updated_at = now()
  returning * into saved_member;

  return jsonb_build_object(
    'ok', true,
    'message', 'Membro adicionado ao staff do Organizador.',
    'member', to_jsonb(saved_member)
  );
end;
$$;

grant execute on function public.sbw_add_tournament_organizer_staff(text, text, text) to authenticated;

create or replace function public.sbw_update_tournament_organizer_staff_role(
  p_organizer text,
  p_member_id text,
  p_role text default 'staff'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  organizer_key text := nullif(trim(coalesce(p_organizer, '')), '');
  member_key text := nullif(trim(coalesce(p_member_id, '')), '');
  requested_role text := lower(trim(coalesce(p_role, 'staff')));
  target_organizer public.tournament_organizers;
  target_member public.tournament_organizer_members;
  permissions_payload jsonb;
begin
  if auth.uid() is null then
    raise exception 'Entre na sua conta para alterar cargos.';
  end if;

  if requested_role not in ('admin', 'manager', 'staff') then
    requested_role := 'staff';
  end if;

  select * into target_organizer
  from public.tournament_organizers o
  where o.id::text = organizer_key or o.slug = organizer_key
  limit 1;

  if target_organizer.id is null then
    raise exception 'Organização de Torneios não encontrada.';
  end if;

  if not public.sbw_can_manage_tournament_organizer(coalesce(target_organizer.slug, target_organizer.id::text)) then
    raise exception 'Você não tem permissão para alterar cargos nesta Organização de Torneios.';
  end if;

  select * into target_member
  from public.tournament_organizer_members m
  where (m.organizer_id = target_organizer.id or m.organizer_slug = target_organizer.slug)
    and (m.id::text = member_key or m.profile_slug = member_key or m.auth_user_id::text = member_key or m.profile_id::text = member_key)
  limit 1;

  if target_member.id is null then
    raise exception 'Membro do staff não encontrado.';
  end if;

  if lower(coalesce(target_member.role, '')) = 'owner' then
    raise exception 'O cargo de dono não pode ser alterado por este painel.';
  end if;

  permissions_payload := jsonb_build_object(
    'canManageOrganizer', requested_role = 'admin',
    'canEditProfile', requested_role in ('admin', 'manager'),
    'canManageStaff', requested_role = 'admin',
    'canCreateTournaments', requested_role in ('admin', 'manager', 'staff'),
    'canManageTournaments', requested_role in ('admin', 'manager', 'staff'),
    'canManageSeasons', requested_role in ('admin', 'manager'),
    'canManageRankings', requested_role in ('admin', 'manager'),
    'canManageSettings', requested_role = 'admin'
  );

  update public.tournament_organizer_members
  set
    role = requested_role,
    permissions = permissions_payload,
    metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
      'roleUpdatedAt', now(),
      'roleUpdatedByAuthUserId', auth.uid(),
      'roleUpdatedSource', 'organizer-staff-v1.6.60'
    ),
    updated_at = now()
  where id = target_member.id
  returning * into target_member;

  return jsonb_build_object(
    'ok', true,
    'message', 'Cargo do staff atualizado.',
    'member', to_jsonb(target_member)
  );
end;
$$;

grant execute on function public.sbw_update_tournament_organizer_staff_role(text, text, text) to authenticated;

create or replace function public.sbw_remove_tournament_organizer_staff(
  p_organizer text,
  p_member_id text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  organizer_key text := nullif(trim(coalesce(p_organizer, '')), '');
  member_key text := nullif(trim(coalesce(p_member_id, '')), '');
  target_organizer public.tournament_organizers;
  target_member public.tournament_organizer_members;
begin
  if auth.uid() is null then
    raise exception 'Entre na sua conta para remover staff.';
  end if;

  select * into target_organizer
  from public.tournament_organizers o
  where o.id::text = organizer_key or o.slug = organizer_key
  limit 1;

  if target_organizer.id is null then
    raise exception 'Organização de Torneios não encontrada.';
  end if;

  if not public.sbw_can_manage_tournament_organizer(coalesce(target_organizer.slug, target_organizer.id::text)) then
    raise exception 'Você não tem permissão para remover staff desta Organização de Torneios.';
  end if;

  select * into target_member
  from public.tournament_organizer_members m
  where (m.organizer_id = target_organizer.id or m.organizer_slug = target_organizer.slug)
    and (m.id::text = member_key or m.profile_slug = member_key or m.auth_user_id::text = member_key or m.profile_id::text = member_key)
  limit 1;

  if target_member.id is null then
    raise exception 'Membro do staff não encontrado.';
  end if;

  if lower(coalesce(target_member.role, '')) = 'owner' then
    raise exception 'O dono da organização não pode ser removido por este painel.';
  end if;

  delete from public.tournament_organizer_members
  where id = target_member.id;

  return jsonb_build_object(
    'ok', true,
    'message', 'Membro removido do staff do Organizador.',
    'memberId', target_member.id
  );
end;
$$;

grant execute on function public.sbw_remove_tournament_organizer_staff(text, text) to authenticated;

select pg_notify('pgrst', 'reload schema');
