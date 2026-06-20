-- -SBW- v1.6.53
-- Criação/edição real de Organização de Torneios no Supabase.
-- Requer a v1.6.52 já aplicada, especialmente:
-- public.organizer_permissions
-- public.sbw_is_platform_admin()
-- public.sbw_get_my_organizer_permission()

-- =========================================================
-- Tabela principal: Organizações de Torneios
-- =========================================================
create table if not exists public.tournament_organizers (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  name text not null,
  display_name text null,
  tag text null,
  type text not null default 'Organizador de torneios',
  status text not null default 'active',
  description text null,
  games jsonb not null default '[]'::jsonb,
  aliases jsonb not null default '[]'::jsonb,
  logo_url text null,
  banner_url text null,
  links jsonb not null default '{}'::jsonb,
  theme jsonb not null default '{}'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  owner_auth_user_id uuid null,
  owner_profile_id uuid null,
  owner_profile_slug text null,
  created_by_auth_user_id uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tournament_organizers
  add column if not exists id uuid default gen_random_uuid(),
  add column if not exists slug text,
  add column if not exists name text,
  add column if not exists display_name text,
  add column if not exists tag text,
  add column if not exists type text default 'Organizador de torneios',
  add column if not exists status text default 'active',
  add column if not exists description text,
  add column if not exists games jsonb default '[]'::jsonb,
  add column if not exists aliases jsonb default '[]'::jsonb,
  add column if not exists logo_url text,
  add column if not exists banner_url text,
  add column if not exists links jsonb default '{}'::jsonb,
  add column if not exists theme jsonb default '{}'::jsonb,
  add column if not exists settings jsonb default '{}'::jsonb,
  add column if not exists metadata jsonb default '{}'::jsonb,
  add column if not exists owner_auth_user_id uuid,
  add column if not exists owner_profile_id uuid,
  add column if not exists owner_profile_slug text,
  add column if not exists created_by_auth_user_id uuid,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

update public.tournament_organizers
set
  id = coalesce(id, gen_random_uuid()),
  slug = nullif(coalesce(slug, id::text), ''),
  name = coalesce(nullif(name, ''), nullif(display_name, ''), 'Organizador'),
  display_name = coalesce(nullif(display_name, ''), nullif(name, '')),
  type = coalesce(nullif(type, ''), 'Organizador de torneios'),
  status = coalesce(nullif(status, ''), 'active'),
  games = coalesce(games, '[]'::jsonb),
  aliases = coalesce(aliases, '[]'::jsonb),
  links = coalesce(links, '{}'::jsonb),
  theme = coalesce(theme, '{}'::jsonb),
  settings = coalesce(settings, '{}'::jsonb),
  metadata = coalesce(metadata, '{}'::jsonb),
  created_at = coalesce(created_at, now()),
  updated_at = coalesce(updated_at, now());

create unique index if not exists tournament_organizers_slug_key
  on public.tournament_organizers(slug);

create index if not exists tournament_organizers_status_idx
  on public.tournament_organizers(status);

create index if not exists tournament_organizers_owner_auth_idx
  on public.tournament_organizers(owner_auth_user_id);

-- =========================================================
-- Equipe inicial da organização: apenas owner nesta versão.
-- Convites/cargos entram na v1.6.54.
-- =========================================================
create table if not exists public.tournament_organizer_members (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid null,
  organizer_slug text null,
  auth_user_id uuid null,
  profile_id uuid null,
  profile_slug text null,
  display_name text null,
  avatar_url text null,
  role text not null default 'member',
  status text not null default 'active',
  joined_at timestamptz null,
  invited_by_auth_user_id uuid null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tournament_organizer_members
  add column if not exists id uuid default gen_random_uuid(),
  add column if not exists organizer_id uuid,
  add column if not exists organizer_slug text,
  add column if not exists auth_user_id uuid,
  add column if not exists profile_id uuid,
  add column if not exists profile_slug text,
  add column if not exists display_name text,
  add column if not exists avatar_url text,
  add column if not exists role text default 'member',
  add column if not exists status text default 'active',
  add column if not exists joined_at timestamptz,
  add column if not exists invited_by_auth_user_id uuid,
  add column if not exists metadata jsonb default '{}'::jsonb,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

update public.tournament_organizer_members
set
  id = coalesce(id, gen_random_uuid()),
  role = coalesce(nullif(role, ''), 'member'),
  status = coalesce(nullif(status, ''), 'active'),
  metadata = coalesce(metadata, '{}'::jsonb),
  created_at = coalesce(created_at, now()),
  updated_at = coalesce(updated_at, now());

create index if not exists tournament_organizer_members_org_idx
  on public.tournament_organizer_members(organizer_id);

create index if not exists tournament_organizer_members_slug_idx
  on public.tournament_organizer_members(organizer_slug);

create index if not exists tournament_organizer_members_auth_idx
  on public.tournament_organizer_members(auth_user_id);

create unique index if not exists tournament_organizer_members_org_auth_key
  on public.tournament_organizer_members(organizer_id, auth_user_id)
  where organizer_id is not null and auth_user_id is not null;

-- =========================================================
-- Helpers
-- =========================================================
drop function if exists public.sbw_slugify(text);

create or replace function public.sbw_slugify(value text)
returns text
language plpgsql
immutable
as $$
declare
  raw text := coalesce(value, '');
  slug text := '';
begin
  raw := lower(raw);
  raw := translate(
    raw,
    'áàâãäåāéèêëēíìîïīóòôõöōúùûüūçñÁÀÂÃÄÅĀÉÈÊËĒÍÌÎÏĪÓÒÔÕÖŌÚÙÛÜŪÇÑ',
    'aaaaaaaeeeeeiiiiioooooouuuuucnAAAAAAAEEEEEIIIIIOOOOOOUUUUUCN'
  );
  slug := regexp_replace(raw, '[^a-z0-9]+', '-', 'g');
  slug := trim(both '-' from slug);

  if slug = '' then
    slug := 'organizacao';
  end if;

  return slug;
end;
$$;

drop function if exists public.sbw_can_create_tournament_organization();

create or replace function public.sbw_can_create_tournament_organization()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return false;
  end if;

  if public.sbw_is_platform_admin() then
    return true;
  end if;

  return exists (
    select 1
    from public.organizer_permissions op
    where op.auth_user_id = auth.uid()
      and lower(coalesce(op.status, '')) in ('approved', 'active', 'enabled')
      and coalesce(op.can_create_organizations, false) is true
  );
end;
$$;

grant execute on function public.sbw_can_create_tournament_organization() to authenticated;

drop function if exists public.sbw_can_manage_tournament_organizer(text);

create or replace function public.sbw_can_manage_tournament_organizer(p_organizer_key text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  key_value text := nullif(trim(coalesce(p_organizer_key, '')), '');
begin
  if auth.uid() is null or key_value is null then
    return false;
  end if;

  if public.sbw_is_platform_admin() then
    return true;
  end if;

  return exists (
    select 1
    from public.tournament_organizer_members tom
    where tom.auth_user_id = auth.uid()
      and lower(coalesce(tom.status, 'active')) in ('active', 'accepted', 'confirmed')
      and lower(coalesce(tom.role, 'member')) in ('owner', 'admin')
      and (
        tom.organizer_slug = key_value
        or tom.organizer_id::text = key_value
      )
  );
end;
$$;

grant execute on function public.sbw_can_manage_tournament_organizer(text) to authenticated;

-- =========================================================
-- RLS
-- =========================================================
alter table public.tournament_organizers enable row level security;
alter table public.tournament_organizer_members enable row level security;

drop policy if exists tournament_organizers_public_select on public.tournament_organizers;
drop policy if exists tournament_organizers_manage_select on public.tournament_organizers;
drop policy if exists tournament_organizers_admin_insert on public.tournament_organizers;
drop policy if exists tournament_organizers_manager_update on public.tournament_organizers;

drop policy if exists tournament_organizer_members_public_select on public.tournament_organizer_members;
drop policy if exists tournament_organizer_members_manage_select on public.tournament_organizer_members;
drop policy if exists tournament_organizer_members_admin_insert on public.tournament_organizer_members;
drop policy if exists tournament_organizer_members_manager_update on public.tournament_organizer_members;

create policy tournament_organizers_public_select
on public.tournament_organizers
for select
using (lower(coalesce(status, 'active')) in ('active', 'approved'));

create policy tournament_organizers_manage_select
on public.tournament_organizers
for select
using (
  public.sbw_is_platform_admin()
  or public.sbw_can_manage_tournament_organizer(slug)
  or owner_auth_user_id = auth.uid()
);

create policy tournament_organizers_admin_insert
on public.tournament_organizers
for insert
with check (public.sbw_is_platform_admin());

create policy tournament_organizers_manager_update
on public.tournament_organizers
for update
using (
  public.sbw_is_platform_admin()
  or public.sbw_can_manage_tournament_organizer(slug)
  or owner_auth_user_id = auth.uid()
)
with check (
  public.sbw_is_platform_admin()
  or public.sbw_can_manage_tournament_organizer(slug)
  or owner_auth_user_id = auth.uid()
);

create policy tournament_organizer_members_public_select
on public.tournament_organizer_members
for select
using (lower(coalesce(status, 'active')) in ('active', 'accepted', 'confirmed'));

create policy tournament_organizer_members_manage_select
on public.tournament_organizer_members
for select
using (
  public.sbw_is_platform_admin()
  or public.sbw_can_manage_tournament_organizer(coalesce(organizer_slug, organizer_id::text))
  or auth_user_id = auth.uid()
);

create policy tournament_organizer_members_admin_insert
on public.tournament_organizer_members
for insert
with check (public.sbw_is_platform_admin());

create policy tournament_organizer_members_manager_update
on public.tournament_organizer_members
for update
using (
  public.sbw_is_platform_admin()
  or public.sbw_can_manage_tournament_organizer(coalesce(organizer_slug, organizer_id::text))
)
with check (
  public.sbw_is_platform_admin()
  or public.sbw_can_manage_tournament_organizer(coalesce(organizer_slug, organizer_id::text))
);

-- =========================================================
-- RPC: criar organização real
-- =========================================================
drop function if exists public.sbw_create_tournament_organizer(jsonb);

create or replace function public.sbw_create_tournament_organizer(p_payload jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  payload jsonb := coalesce(p_payload, '{}'::jsonb);
  current_profile public.profiles;
  raw_name text := trim(coalesce(payload->>'name', payload->>'displayName', payload->>'display_name', ''));
  base_slug text := public.sbw_slugify(coalesce(nullif(payload->>'slug', ''), raw_name));
  final_slug text := '';
  slug_try text := '';
  counter integer := 1;
  saved_organizer public.tournament_organizers;
  status_value text := lower(coalesce(nullif(payload->>'status', ''), 'active'));
  is_admin boolean := false;
begin
  if auth.uid() is null then
    raise exception 'Entre na sua conta para criar uma Organização de Torneios.';
  end if;

  if not public.sbw_can_create_tournament_organization() then
    raise exception 'Sua conta ainda não possui permissão da -SBW- para criar Organização de Torneios.';
  end if;

  if raw_name = '' then
    raise exception 'Informe o nome público da Organização de Torneios.';
  end if;

  is_admin := public.sbw_is_platform_admin();

  if not is_admin and exists (
    select 1
    from public.tournament_organizer_members tom
    where tom.auth_user_id = auth.uid()
      and lower(coalesce(tom.role, '')) = 'owner'
      and lower(coalesce(tom.status, 'active')) in ('active', 'accepted', 'confirmed')
  ) then
    raise exception 'Esta conta já possui uma Organização de Torneios como owner. Peça à -SBW- para liberar outro fluxo se precisar de múltiplas organizações.';
  end if;

  select *
    into current_profile
  from public.profiles p
  where p.auth_user_id = auth.uid()
     or p.id::text = auth.uid()::text
  limit 1;

  loop
    slug_try := case when counter = 1 then base_slug else base_slug || '-' || counter::text end;

    exit when not exists (
      select 1
      from public.tournament_organizers o
      where o.slug = slug_try
    );

    counter := counter + 1;
  end loop;

  final_slug := slug_try;

  if status_value not in ('active', 'pending', 'inactive', 'draft') then
    status_value := 'active';
  end if;

  insert into public.tournament_organizers (
    slug,
    name,
    display_name,
    tag,
    type,
    status,
    description,
    games,
    aliases,
    logo_url,
    banner_url,
    links,
    theme,
    owner_auth_user_id,
    owner_profile_id,
    owner_profile_slug,
    created_by_auth_user_id,
    metadata,
    created_at,
    updated_at
  ) values (
    final_slug,
    raw_name,
    coalesce(nullif(payload->>'displayName', ''), raw_name),
    nullif(upper(trim(coalesce(payload->>'tag', ''))), ''),
    coalesce(nullif(payload->>'type', ''), 'Organizador de torneios'),
    status_value,
    nullif(payload->>'description', ''),
    coalesce(payload->'games', '[]'::jsonb),
    coalesce(payload->'aliases', '[]'::jsonb),
    nullif(coalesce(payload->>'logoUrl', payload->>'logo_url', ''), ''),
    nullif(coalesce(payload->>'bannerUrl', payload->>'banner_url', ''), ''),
    coalesce(payload->'links', '{}'::jsonb),
    coalesce(payload->'theme', '{}'::jsonb),
    auth.uid(),
    current_profile.id,
    coalesce(current_profile.slug, current_profile.username),
    auth.uid(),
    jsonb_build_object(
      'source', 'organizer-create-v1.6.53',
      'ownerProfileSlug', coalesce(current_profile.slug, current_profile.username, ''),
      'ownerDisplayName', coalesce(current_profile.display_name, current_profile.username, '')
    ),
    now(),
    now()
  ) returning * into saved_organizer;

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
    joined_at,
    invited_by_auth_user_id,
    metadata,
    created_at,
    updated_at
  ) values (
    saved_organizer.id,
    saved_organizer.slug,
    auth.uid(),
    current_profile.id,
    coalesce(current_profile.slug, current_profile.username),
    coalesce(current_profile.display_name, current_profile.username, 'Owner'),
    current_profile.avatar_url,
    'owner',
    'active',
    now(),
    auth.uid(),
    jsonb_build_object('source', 'organizer-owner-v1.6.53'),
    now(),
    now()
  )
  on conflict (organizer_id, auth_user_id) where organizer_id is not null and auth_user_id is not null
  do update set
    organizer_slug = excluded.organizer_slug,
    profile_id = excluded.profile_id,
    profile_slug = excluded.profile_slug,
    display_name = excluded.display_name,
    avatar_url = excluded.avatar_url,
    role = 'owner',
    status = 'active',
    joined_at = coalesce(public.tournament_organizer_members.joined_at, now()),
    metadata = coalesce(public.tournament_organizer_members.metadata, '{}'::jsonb) || excluded.metadata,
    updated_at = now();

  return jsonb_build_object(
    'ok', true,
    'message', 'Organização de Torneios criada no Supabase.',
    'organizer', to_jsonb(saved_organizer)
  );
end;
$$;

grant execute on function public.sbw_create_tournament_organizer(jsonb) to authenticated;

-- =========================================================
-- RPC: atualizar perfil público da organização
-- =========================================================
drop function if exists public.sbw_update_tournament_organizer_profile(text, jsonb);

create or replace function public.sbw_update_tournament_organizer_profile(
  p_slug text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  payload jsonb := coalesce(p_payload, '{}'::jsonb);
  key_value text := nullif(trim(coalesce(p_slug, '')), '');
  target_organizer public.tournament_organizers;
  saved_organizer public.tournament_organizers;
  next_name text := trim(coalesce(payload->>'name', payload->>'displayName', payload->>'display_name', ''));
  status_value text := lower(coalesce(nullif(payload->>'status', ''), 'active'));
begin
  if auth.uid() is null then
    raise exception 'Entre na sua conta para editar a Organização de Torneios.';
  end if;

  if key_value is null then
    raise exception 'Organização não informada.';
  end if;

  select *
    into target_organizer
  from public.tournament_organizers o
  where o.slug = key_value
     or o.id::text = key_value
  limit 1;

  if target_organizer.id is null then
    raise exception 'Organização de Torneios não encontrada.';
  end if;

  if not public.sbw_can_manage_tournament_organizer(coalesce(target_organizer.slug, target_organizer.id::text)) then
    raise exception 'Você não tem permissão para editar esta Organização de Torneios.';
  end if;

  if next_name = '' then
    next_name := target_organizer.name;
  end if;

  if status_value not in ('active', 'pending', 'inactive', 'draft') then
    status_value := target_organizer.status;
  end if;

  update public.tournament_organizers
  set
    name = next_name,
    display_name = coalesce(nullif(payload->>'displayName', ''), next_name),
    tag = nullif(upper(trim(coalesce(payload->>'tag', target_organizer.tag, ''))), ''),
    type = coalesce(nullif(payload->>'type', ''), target_organizer.type, 'Organizador de torneios'),
    status = status_value,
    description = nullif(coalesce(payload->>'description', target_organizer.description, ''), ''),
    games = coalesce(payload->'games', target_organizer.games, '[]'::jsonb),
    aliases = coalesce(payload->'aliases', target_organizer.aliases, '[]'::jsonb),
    logo_url = nullif(coalesce(payload->>'logoUrl', payload->>'logo_url', target_organizer.logo_url, ''), ''),
    banner_url = nullif(coalesce(payload->>'bannerUrl', payload->>'banner_url', target_organizer.banner_url, ''), ''),
    links = coalesce(payload->'links', target_organizer.links, '{}'::jsonb),
    theme = coalesce(payload->'theme', target_organizer.theme, '{}'::jsonb),
    metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
      'updatedByAuthUserId', auth.uid(),
      'updatedSource', 'organizer-update-v1.6.53'
    ),
    updated_at = now()
  where id = target_organizer.id
  returning * into saved_organizer;

  update public.tournament_organizer_members
  set organizer_slug = saved_organizer.slug,
      updated_at = now()
  where organizer_id = saved_organizer.id;

  return jsonb_build_object(
    'ok', true,
    'message', 'Organização de Torneios atualizada no Supabase.',
    'organizer', to_jsonb(saved_organizer)
  );
end;
$$;

grant execute on function public.sbw_update_tournament_organizer_profile(text, jsonb) to authenticated;

-- =========================================================
-- RPC: listar organizações que o usuário atual gerencia
-- =========================================================
drop function if exists public.sbw_get_my_tournament_organizers();

create or replace function public.sbw_get_my_tournament_organizers()
returns setof public.tournament_organizers
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return;
  end if;

  if public.sbw_is_platform_admin() then
    return query
    select *
    from public.tournament_organizers o
    order by coalesce(o.updated_at, o.created_at, now()) desc;
    return;
  end if;

  return query
  select distinct o.*
  from public.tournament_organizers o
  join public.tournament_organizer_members tom
    on tom.organizer_id = o.id
    or tom.organizer_slug = o.slug
  where tom.auth_user_id = auth.uid()
    and lower(coalesce(tom.status, 'active')) in ('active', 'accepted', 'confirmed')
    and lower(coalesce(tom.role, 'member')) in ('owner', 'admin', 'manager', 'staff')
  order by coalesce(o.updated_at, o.created_at, now()) desc;
end;
$$;

grant execute on function public.sbw_get_my_tournament_organizers() to authenticated;
