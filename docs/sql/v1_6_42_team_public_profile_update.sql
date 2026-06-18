-- -SBW- v1.6.42
-- Atualiza dados públicos da equipe com permissão centralizada.
-- Correção: parâmetros prefixados com p_ para evitar ambiguidade com colunas como primary_color.

create or replace function public.sbw_update_team_public_profile(
  p_team_key text,
  p_team_name text,
  p_team_tag text,
  p_team_description text default '',
  p_primary_color text default '#00e5ff',
  p_secondary_color text default '#7c3cff',
  p_social_links_payload jsonb default '{}'::jsonb,
  p_recruitment_payload jsonb default '{}'::jsonb,
  p_games_payload jsonb default '[]'::jsonb,
  p_team_type_payload jsonb default '{}'::jsonb
)
returns public.teams
language plpgsql
security definer
set search_path = public
as $$
declare
  target_team public.teams;
  updated_team public.teams;
  normalized_tag text;
  next_metadata jsonb;
begin
  select *
    into target_team
  from public.teams t
  where t.slug = p_team_key
     or t.id::text = p_team_key
  limit 1;

  if target_team.id is null then
    raise exception 'Equipe não encontrada.';
  end if;

  if not public.sbw_can_manage_team_assets(p_team_key) then
    raise exception 'Você não tem permissão para editar esta equipe.';
  end if;

  normalized_tag := upper(regexp_replace(trim(coalesce(p_team_tag, '')), '[^A-Za-z0-9_-]', '', 'g'));

  if length(trim(coalesce(p_team_name, ''))) < 2 then
    raise exception 'Informe o nome da equipe.';
  end if;

  if length(normalized_tag) < 2 then
    raise exception 'A tag precisa ter pelo menos 2 caracteres.';
  end if;

  if length(normalized_tag) > 12 then
    raise exception 'A tag pode ter no máximo 12 caracteres.';
  end if;

  if normalized_tag in ('SBW', 'SABERWOLF', 'ADMIN', 'MOD', 'STAFF') then
    raise exception 'Essa tag é reservada pela -SBW-.';
  end if;

  if exists (
    select 1
    from public.teams t
    where upper(coalesce(t.tag, '')) = normalized_tag
      and t.id <> target_team.id
  ) then
    raise exception 'Essa tag já está sendo usada por outra equipe.';
  end if;

  next_metadata := coalesce(target_team.metadata, '{}'::jsonb)
    || jsonb_build_object(
      'recruitmentOpen', coalesce((p_recruitment_payload->>'isOpen')::boolean, false),
      'recruitmentGames', coalesce(p_recruitment_payload->'games', '[]'::jsonb),
      'recruitmentDescription', coalesce(p_recruitment_payload->>'description', ''),
      'teamType', coalesce(p_team_type_payload, '{}'::jsonb),
      'publicProfileEditedAt', now(),
      'publicProfileEditedBy', auth.uid()
    );

  update public.teams t
  set
    name = trim(p_team_name),
    tag = normalized_tag,
    description = coalesce(p_team_description, ''),
    bio = coalesce(p_team_description, ''),
    primary_color = coalesce(p_primary_color, '#00e5ff'),
    secondary_color = coalesce(p_secondary_color, '#7c3cff'),
    social_links = coalesce(p_social_links_payload, '{}'::jsonb),
    games = coalesce(p_games_payload, '[]'::jsonb),
    metadata = next_metadata,
    updated_at = now()
  where t.id = target_team.id
  returning * into updated_team;

  return updated_team;
end;
$$;

grant execute on function public.sbw_update_team_public_profile(
  text,
  text,
  text,
  text,
  text,
  text,
  jsonb,
  jsonb,
  jsonb,
  jsonb
) to authenticated;
