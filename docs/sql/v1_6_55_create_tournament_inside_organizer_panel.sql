-- -SBW- v1.6.55
-- Criar Torneio dentro do Painel do Organizador.
-- Objetivo:
-- 1. Listar apenas Organizações de Torneios onde o usuário pode criar torneios.
-- 2. Criar torneios via RPC validando permissão por organização.
-- 3. Garantir vínculo real do torneio com tournament_organizers.
-- 4. Remover dependência de botão global "Criar torneio" para usuários comuns.

-- Helper de permissão por organização.
drop function if exists public.sbw_can_create_tournament_for_organizer(text);

create or replace function public.sbw_can_create_tournament_for_organizer(p_organizer_key text)
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
      and lower(coalesce(tom.role, 'member')) in (
        'owner',
        'admin',
        'manager',
        'organizer_admin',
        'tournament_admin'
      )
      and (
        tom.organizer_id::text = key_value
        or tom.organizer_slug = key_value
      )
  );
end;
$$;

grant execute on function public.sbw_can_create_tournament_for_organizer(text) to authenticated;

-- Lista segura das organizações em que o usuário logado pode criar torneios.
drop function if exists public.sbw_get_my_tournament_organizer_access();

create or replace function public.sbw_get_my_tournament_organizer_access()
returns table (
  id uuid,
  slug text,
  name text,
  display_name text,
  tag text,
  logo_url text,
  banner_url text,
  organizer_status text,
  member_role text,
  member_status text,
  can_create_tournaments boolean,
  metadata jsonb
)
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
    select
      o.id,
      o.slug,
      o.name,
      o.display_name,
      o.tag,
      o.logo_url,
      o.banner_url,
      o.status as organizer_status,
      'admin_sbw'::text as member_role,
      'active'::text as member_status,
      true as can_create_tournaments,
      coalesce(o.metadata, '{}'::jsonb) as metadata
    from public.tournament_organizers o
    where lower(coalesce(o.status, 'active')) in ('active', 'approved', 'published', 'public')
    order by o.name asc;

    return;
  end if;

  return query
  select
    o.id,
    o.slug,
    o.name,
    o.display_name,
    o.tag,
    o.logo_url,
    o.banner_url,
    o.status as organizer_status,
    tom.role as member_role,
    tom.status as member_status,
    (
      lower(coalesce(tom.status, 'active')) in ('active', 'accepted', 'confirmed')
      and lower(coalesce(tom.role, 'member')) in (
        'owner',
        'admin',
        'manager',
        'organizer_admin',
        'tournament_admin'
      )
    ) as can_create_tournaments,
    coalesce(o.metadata, '{}'::jsonb) as metadata
  from public.tournament_organizer_members tom
  join public.tournament_organizers o
    on o.id = tom.organizer_id
    or o.slug = tom.organizer_slug
  where tom.auth_user_id = auth.uid()
    and lower(coalesce(tom.status, 'active')) in ('active', 'accepted', 'confirmed')
    and lower(coalesce(o.status, 'active')) in ('active', 'approved', 'published', 'public')
  order by o.name asc;
end;
$$;

grant execute on function public.sbw_get_my_tournament_organizer_access() to authenticated;

-- Criação segura de torneio vinculado a uma organização.
drop function if exists public.sbw_create_tournament_for_organizer(jsonb);

create or replace function public.sbw_create_tournament_for_organizer(p_payload jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  payload jsonb := coalesce(p_payload, '{}'::jsonb);
  target_organizer public.tournament_organizers;
  current_profile public.profiles;
  raw_title text := trim(coalesce(payload->>'title', payload->>'name', ''));
  raw_game text := trim(coalesce(payload->>'game_name', payload->>'gameName', payload->>'game', ''));
  organizer_key text := trim(coalesce(
    payload->>'tournament_organizer_id',
    payload->>'organizer_id',
    payload->>'organizer_slug',
    payload->>'organizerSlug',
    ''
  ));
  base_slug text := '';
  slug_try text := '';
  counter integer := 1;
  saved_tournament public.tournaments;
  status_value text := lower(trim(coalesce(payload->>'status', 'draft')));
  visibility_value text := lower(trim(coalesce(payload->>'visibility', 'public')));
begin
  if auth.uid() is null then
    raise exception 'Entre na sua conta para criar torneios.';
  end if;

  if organizer_key = '' then
    raise exception 'Crie o torneio a partir do Painel do Organizador para vincular uma organização real.';
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

  if not public.sbw_can_create_tournament_for_organizer(target_organizer.id::text)
     and not public.sbw_can_create_tournament_for_organizer(target_organizer.slug)
  then
    raise exception 'Você não tem permissão para criar torneios nesta organização.';
  end if;

  if raw_title = '' then
    raise exception 'Informe o nome do torneio.';
  end if;

  if raw_game = '' then
    raise exception 'Informe o jogo do torneio.';
  end if;

  if status_value not in (
    'draft',
    'registration-open',
    'open',
    'published',
    'scheduled',
    'structure-generated',
    'in-progress',
    'running',
    'finished',
    'completed',
    'cancelled',
    'archived'
  ) then
    status_value := 'draft';
  end if;

  if visibility_value not in ('public', 'private', 'unlisted') then
    visibility_value := 'public';
  end if;

  select *
    into current_profile
  from public.profiles p
  where p.auth_user_id = auth.uid()
     or p.id::text = auth.uid()::text
  limit 1;

  base_slug := public.sbw_slugify(coalesce(nullif(payload->>'slug', ''), raw_title));

  loop
    slug_try := case when counter = 1 then base_slug else base_slug || '-' || counter::text end;

    exit when not exists (
      select 1
      from public.tournaments t
      where t.slug = slug_try
    );

    counter := counter + 1;
  end loop;

  insert into public.tournaments (
    slug,
    title,
    description,
    rules,
    prize_text,
    game_id,
    game_name,
    platform,
    format,
    status,
    visibility,
    tournament_organizer_id,
    organizer_id,
    organizer_slug,
    organizer_name,
    max_participants,
    current_participants,
    registration_opens_at,
    registration_closes_at,
    checkin_starts_at,
    starts_at,
    ends_at,
    cover_url,
    settings,
    metadata,
    created_by_auth_user_id,
    created_by_profile_id,
    created_at,
    updated_at
  ) values (
    slug_try,
    raw_title,
    nullif(payload->>'description', ''),
    nullif(payload->>'rules', ''),
    nullif(coalesce(payload->>'prize_text', payload->>'prizeText', ''), ''),
    coalesce(nullif(payload->>'game_id', ''), public.sbw_slugify(raw_game)),
    raw_game,
    coalesce(nullif(payload->>'platform', ''), 'crossplay'),
    coalesce(nullif(payload->>'format', ''), 'double-elimination'),
    status_value,
    visibility_value,
    target_organizer.id,
    target_organizer.id::text,
    target_organizer.slug,
    target_organizer.name,
    nullif(payload->>'max_participants', '')::integer,
    coalesce(nullif(payload->>'current_participants', '')::integer, 0),
    nullif(payload->>'registration_opens_at', '')::timestamptz,
    nullif(payload->>'registration_closes_at', '')::timestamptz,
    nullif(payload->>'checkin_starts_at', '')::timestamptz,
    nullif(payload->>'starts_at', '')::timestamptz,
    nullif(payload->>'ends_at', '')::timestamptz,
    nullif(coalesce(payload->>'cover_url', payload->>'coverUrl', ''), ''),
    coalesce(payload->'settings', '{}'::jsonb),
    coalesce(payload->'metadata', '{}'::jsonb) || jsonb_build_object(
      'source', 'organizer-tournament-create-v1.6.55',
      'organizerId', target_organizer.id,
      'organizerSlug', target_organizer.slug,
      'organizerName', target_organizer.name,
      'createdByProfileSlug', coalesce(current_profile.slug, current_profile.username, '')
    ),
    auth.uid(),
    current_profile.id,
    now(),
    now()
  ) returning * into saved_tournament;

  return jsonb_build_object(
    'ok', true,
    'message', 'Torneio criado e vinculado à Organização de Torneios.',
    'tournament', to_jsonb(saved_tournament)
  );
end;
$$;

grant execute on function public.sbw_create_tournament_for_organizer(jsonb) to authenticated;

select pg_notify('pgrst', 'reload schema');
