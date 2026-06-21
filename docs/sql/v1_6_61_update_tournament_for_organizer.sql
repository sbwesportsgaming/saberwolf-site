-- -SBW- v1.6.61
-- Gestão real dos torneios pelo Organizador.
-- Permite editar dados básicos de torneios vinculados à organização real.

create or replace function public.sbw_update_tournament_for_organizer(
  p_organizer text,
  p_tournament text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  organizer_key text := nullif(trim(coalesce(p_organizer, '')), '');
  tournament_key text := nullif(trim(coalesce(p_tournament, '')), '');
  payload jsonb := coalesce(p_payload, '{}'::jsonb);
  target_organizer public.tournament_organizers;
  target_tournament public.tournaments;
  saved_tournament public.tournaments;
  title_value text;
  game_value text;
  status_value text;
  format_value text;
  starts_value timestamptz;
begin
  if auth.uid() is null then
    raise exception 'Entre na sua conta para editar torneios.';
  end if;

  if organizer_key is null then
    raise exception 'Organizador não informado.';
  end if;

  if tournament_key is null then
    raise exception 'Torneio não informado.';
  end if;

  select *
    into target_organizer
  from public.tournament_organizers o
  where o.id::text = organizer_key
     or lower(o.slug) = lower(organizer_key)
  limit 1;

  if target_organizer.id is null then
    raise exception 'Organização de Torneios não encontrada.';
  end if;

  if not public.sbw_can_manage_tournament_organizer(coalesce(target_organizer.slug, target_organizer.id::text)) then
    raise exception 'Você não tem permissão para editar torneios desta organização.';
  end if;

  select *
    into target_tournament
  from public.tournaments t
  where (t.id::text = tournament_key or lower(t.slug) = lower(tournament_key))
    and (
      t.tournament_organizer_id = target_organizer.id
      or t.organizer_id::text = target_organizer.id::text
      or lower(coalesce(t.organizer_slug, '')) = lower(coalesce(target_organizer.slug, ''))
    )
  limit 1;

  if target_tournament.id is null then
    raise exception 'Torneio não encontrado nesta organização.';
  end if;

  title_value := nullif(trim(coalesce(payload->>'title', payload->>'name', target_tournament.title)), '');
  game_value := nullif(trim(coalesce(payload->>'game_name', payload->>'gameName', payload->>'game', target_tournament.game_name)), '');
  status_value := lower(nullif(trim(coalesce(payload->>'status', target_tournament.status, 'draft')), ''));
  format_value := nullif(trim(coalesce(payload->>'format', target_tournament.format, 'double-elimination')), '');

  if title_value is null then
    raise exception 'Informe o nome do torneio.';
  end if;

  if game_value is null then
    raise exception 'Informe o jogo do torneio.';
  end if;

  if status_value not in (
    'draft',
    'published',
    'registration-open',
    'open',
    'scheduled',
    'structure-generated',
    'in-progress',
    'running',
    'finished',
    'completed',
    'cancelled',
    'archived'
  ) then
    status_value := coalesce(target_tournament.status, 'draft');
  end if;

  starts_value := case
    when payload ? 'starts_at' and nullif(payload->>'starts_at', '') is not null
      then nullif(payload->>'starts_at', '')::timestamptz
    when payload ? 'startDate' and nullif(payload->>'startDate', '') is not null
      then nullif(payload->>'startDate', '')::timestamptz
    else target_tournament.starts_at
  end;

  update public.tournaments
  set
    title = title_value,
    description = case
      when payload ? 'description' then coalesce(payload->>'description', '')
      else target_tournament.description
    end,
    rules = case
      when payload ? 'rules' then coalesce(payload->>'rules', '')
      else target_tournament.rules
    end,
    game_name = game_value,
    game_id = coalesce(nullif(payload->>'game_id', ''), target_tournament.game_id, public.sbw_slugify(game_value)),
    format = format_value,
    status = status_value,
    max_participants = case
      when payload ? 'max_participants' and nullif(payload->>'max_participants', '') is not null
        then nullif(payload->>'max_participants', '')::integer
      else target_tournament.max_participants
    end,
    starts_at = starts_value,
    cover_url = case
      when payload ? 'cover_url' then nullif(payload->>'cover_url', '')
      when payload ? 'coverUrl' then nullif(payload->>'coverUrl', '')
      else target_tournament.cover_url
    end,
    tournament_organizer_id = target_organizer.id,
    organizer_id = target_organizer.id,
    organizer_slug = target_organizer.slug,
    organizer_name = target_organizer.name,
    metadata = coalesce(target_tournament.metadata, '{}'::jsonb)
      || jsonb_build_object(
        'updatedFromOrganizerPanel', true,
        'updatedFromOrganizerPanelAt', now(),
        'updatedFromOrganizerPanelByAuthUserId', auth.uid(),
        'updatedFromOrganizerPanelVersion', 'v1.6.61'
      ),
    updated_at = now()
  where id = target_tournament.id
  returning * into saved_tournament;

  return jsonb_build_object(
    'ok', true,
    'message', 'Torneio atualizado.',
    'tournament', to_jsonb(saved_tournament)
  );
end;
$$;

grant execute on function public.sbw_update_tournament_for_organizer(text, text, jsonb) to authenticated;

select pg_notify('pgrst', 'reload schema');
