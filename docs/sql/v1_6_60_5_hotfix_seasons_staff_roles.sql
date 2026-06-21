-- -SBW- v1.6.60.5
-- Hotfix: temporadas, cargos do staff e salvamento seguro do perfil do organizador.

-- 1) Garante que cargos usados pelo painel interno são aceitos pela tabela real.
alter table public.tournament_organizer_members
  drop constraint if exists tournament_organizer_members_role_check;

alter table public.tournament_organizer_members
  add constraint tournament_organizer_members_role_check
  check (
    lower(coalesce(role, '')) in (
      'owner',
      'admin',
      'manager',
      'staff',
      'member',
      'organizer_admin',
      'tournament_admin'
    )
  );

-- 2) Garante colunas visuais usadas na listagem de staff.
alter table public.tournament_organizer_members
  add column if not exists display_name text;

alter table public.tournament_organizer_members
  add column if not exists avatar_url text;

update public.tournament_organizer_members
set display_name = coalesce(display_name, profile_slug, 'Membro autorizado')
where display_name is null;

-- 3) Reforça a RPC de salvar perfil para nunca gravar name como null.
create or replace function public.sbw_update_tournament_organizer_profile(
  p_payload jsonb default '{}'::jsonb,
  p_slug text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  payload jsonb := coalesce(p_payload, '{}'::jsonb);
  key_value text := nullif(trim(coalesce(p_slug, payload->>'slug', payload->>'id', '')), '');
  target_organizer public.tournament_organizers;
  saved_organizer public.tournament_organizers;
  organizer_games text[] := array[]::text[];
  current_metadata jsonb := '{}'::jsonb;
  incoming_metadata jsonb := coalesce(payload->'metadata', '{}'::jsonb);
  incoming_links jsonb := coalesce(
    payload->'links',
    payload->'socialLinks',
    payload->'social_links',
    '{}'::jsonb
  );
  incoming_theme jsonb := coalesce(
    payload->'theme',
    payload->'visualIdentity',
    payload->'visual_identity',
    '{}'::jsonb
  );
  safe_name text;
begin
  if auth.uid() is null then
    raise exception 'Entre na sua conta para editar esta Organização de Torneios.';
  end if;

  if key_value is null then
    raise exception 'Organizador não informado.';
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

  safe_name := coalesce(
    nullif(trim(payload->>'name'), ''),
    nullif(trim(payload->>'displayName'), ''),
    nullif(trim(payload->>'publicName'), ''),
    nullif(trim(target_organizer.name), ''),
    nullif(trim(target_organizer.slug), ''),
    'Organizador'
  );

  if jsonb_typeof(coalesce(payload->'games', '[]'::jsonb)) = 'array' then
    select coalesce(
      array_agg(
        nullif(
          trim(
            coalesce(
              game_item->>'name',
              game_item->>'id',
              game_item->>'title',
              trim(both '"' from game_item::text)
            )
          ),
          ''
        )
      ) filter (
        where nullif(
          trim(
            coalesce(
              game_item->>'name',
              game_item->>'id',
              game_item->>'title',
              trim(both '"' from game_item::text)
            )
          ),
          ''
        ) is not null
      ),
      array[]::text[]
    )
    into organizer_games
    from jsonb_array_elements(coalesce(payload->'games', '[]'::jsonb)) as game_item;
  else
    organizer_games := coalesce(target_organizer.games, array[]::text[]);
  end if;

  current_metadata := coalesce(target_organizer.metadata, '{}'::jsonb);

  update public.tournament_organizers
  set
    name = safe_name,
    description = nullif(coalesce(payload->>'description', target_organizer.description, ''), ''),
    short_description = nullif(coalesce(
      payload->>'shortDescription',
      payload->>'short_description',
      payload->>'tagline',
      payload->>'slogan',
      target_organizer.short_description,
      ''
    ), ''),
    logo_url = case
      when payload ? 'logoUrl' then nullif(payload->>'logoUrl', '')
      when payload ? 'logo_url' then nullif(payload->>'logo_url', '')
      else target_organizer.logo_url
    end,
    banner_url = case
      when payload ? 'bannerUrl' then nullif(payload->>'bannerUrl', '')
      when payload ? 'banner_url' then nullif(payload->>'banner_url', '')
      else target_organizer.banner_url
    end,
    country = nullif(coalesce(payload->>'country', target_organizer.country, ''), ''),
    region = nullif(coalesce(payload->>'region', target_organizer.region, ''), ''),
    website_url = nullif(coalesce(payload->>'websiteUrl', payload->>'website_url', target_organizer.website_url, ''), ''),
    social_links = case
      when incoming_links <> '{}'::jsonb then incoming_links
      else coalesce(target_organizer.social_links, '{}'::jsonb)
    end,
    games = organizer_games,
    metadata = current_metadata
      || incoming_metadata
      || jsonb_build_object(
        'tag', nullif(coalesce(payload->>'tag', current_metadata->>'tag', ''), ''),
        'type', nullif(coalesce(payload->>'type', current_metadata->>'type', 'Organizador de torneios'), ''),
        'tagline', nullif(coalesce(
          payload->>'tagline',
          payload->>'slogan',
          payload->>'headline',
          payload->>'shortDescription',
          current_metadata->>'tagline',
          ''
        ), ''),
        'theme', case
          when incoming_theme <> '{}'::jsonb then incoming_theme
          else coalesce(current_metadata->'theme', '{}'::jsonb)
        end,
        'links', case
          when incoming_links <> '{}'::jsonb then incoming_links
          else coalesce(current_metadata->'links', '{}'::jsonb)
        end,
        'profileUpdatedAt', now(),
        'profileUpdatedByAuthUserId', auth.uid(),
        'profileUpdatedSource', 'organizer-profile-v1.6.60.5'
      ),
    updated_at = now()
  where id = target_organizer.id
  returning * into saved_organizer;

  return jsonb_build_object(
    'ok', true,
    'message', 'Perfil do Organizador atualizado.',
    'organizer', to_jsonb(saved_organizer)
  );
end;
$$;

grant execute on function public.sbw_update_tournament_organizer_profile(jsonb, text) to authenticated;

select pg_notify('pgrst', 'reload schema');
