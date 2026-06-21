-- -SBW- v1.6.64
-- Gestão de inscritos e check-in pelo Organizador.
-- Cria RPCs seguras para o painel interno listar e atualizar participantes reais do torneio.

create or replace function public.sbw_get_tournament_participants_for_organizer(
  p_organizer text,
  p_tournament text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  organizer_key text := nullif(trim(coalesce(p_organizer, '')), '');
  tournament_key text := nullif(trim(coalesce(p_tournament, '')), '');
  target_organizer public.tournament_organizers;
  target_tournament public.tournaments;
  participants_value jsonb := '[]'::jsonb;
  stats_value jsonb := '{}'::jsonb;
begin
  if auth.uid() is null then
    raise exception 'Entre na sua conta para gerenciar inscritos.';
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
    raise exception 'Você não tem permissão para gerenciar inscritos desta organização.';
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

  select coalesce(jsonb_agg(to_jsonb(tp) order by tp.seed nulls last, tp.created_at asc), '[]'::jsonb)
    into participants_value
  from public.tournament_participants tp
  where tp.tournament_id = target_tournament.id::text
     or tp.tournament_id = target_tournament.slug
     or tp.tournament_slug = target_tournament.slug
     or tp.tournament_slug = target_tournament.id::text;

  select jsonb_build_object(
    'registered', count(*) filter (where status = 'registered'),
    'waitlist', count(*) filter (where status = 'waitlist'),
    'checkedIn', count(*) filter (where check_in_status = 'checked_in'),
    'removed', count(*) filter (where status in ('removed', 'cancelled', 'disqualified')),
    'total', count(*)
  )
    into stats_value
  from public.tournament_participants tp
  where tp.tournament_id = target_tournament.id::text
     or tp.tournament_id = target_tournament.slug
     or tp.tournament_slug = target_tournament.slug
     or tp.tournament_slug = target_tournament.id::text;

  return jsonb_build_object(
    'ok', true,
    'message', 'Inscritos carregados.',
    'tournament', to_jsonb(target_tournament),
    'participants', participants_value,
    'stats', coalesce(stats_value, '{}'::jsonb)
  );
end;
$$;

create or replace function public.sbw_update_tournament_participant_for_organizer(
  p_organizer text,
  p_tournament text,
  p_participant text,
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
  participant_key text := nullif(trim(coalesce(p_participant, '')), '');
  payload jsonb := coalesce(p_payload, '{}'::jsonb);
  target_organizer public.tournament_organizers;
  target_tournament public.tournaments;
  target_participant public.tournament_participants;
  saved_participant public.tournament_participants;
  next_status text;
  next_check_in text;
  next_seed integer;
  stats_value jsonb := '{}'::jsonb;
begin
  if auth.uid() is null then
    raise exception 'Entre na sua conta para gerenciar inscritos.';
  end if;

  if organizer_key is null then
    raise exception 'Organizador não informado.';
  end if;

  if tournament_key is null then
    raise exception 'Torneio não informado.';
  end if;

  if participant_key is null then
    raise exception 'Inscrição não informada.';
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
    raise exception 'Você não tem permissão para gerenciar inscritos desta organização.';
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

  select *
    into target_participant
  from public.tournament_participants tp
  where tp.id::text = participant_key
    and (
      tp.tournament_id = target_tournament.id::text
      or tp.tournament_id = target_tournament.slug
      or tp.tournament_slug = target_tournament.slug
      or tp.tournament_slug = target_tournament.id::text
    )
  limit 1;

  if target_participant.id is null then
    raise exception 'Inscrição não encontrada neste torneio.';
  end if;

  next_status := lower(replace(nullif(trim(coalesce(payload->>'status', target_participant.status)), ''), '-', '_'));
  next_check_in := lower(replace(nullif(trim(coalesce(payload->>'check_in_status', payload->>'checkInStatus', target_participant.check_in_status)), ''), '-', '_'));

  if next_status not in ('registered', 'waitlist', 'cancelled', 'removed', 'disqualified') then
    next_status := target_participant.status;
  end if;

  if next_check_in in ('checked', 'confirmed', 'confirmado') then
    next_check_in := 'checked_in';
  end if;

  if next_check_in not in ('pending', 'checked_in', 'missed', 'waived') then
    next_check_in := target_participant.check_in_status;
  end if;

  if payload ? 'seed' and nullif(payload->>'seed', '') is not null then
    next_seed := nullif(payload->>'seed', '')::integer;
  else
    next_seed := target_participant.seed;
  end if;

  update public.tournament_participants
  set
    status = next_status,
    check_in_status = next_check_in,
    seed = next_seed,
    metadata = coalesce(target_participant.metadata, '{}'::jsonb)
      || jsonb_build_object(
        'managedFromOrganizerPanel', true,
        'managedFromOrganizerPanelAt', now(),
        'managedFromOrganizerPanelByAuthUserId', auth.uid(),
        'managedFromOrganizerPanelVersion', 'v1.6.64'
      ),
    updated_at = now()
  where id = target_participant.id
  returning * into saved_participant;

  if to_regprocedure('public.sbw_recount_tournament_participants(text)') is not null then
    perform public.sbw_recount_tournament_participants(target_tournament.id::text);
    if target_tournament.slug is not null then
      perform public.sbw_recount_tournament_participants(target_tournament.slug);
    end if;
  else
    update public.tournaments t
    set
      current_participants = (
        select count(*)::integer
        from public.tournament_participants tp
        where tp.status in ('registered', 'waitlist')
          and (
            tp.tournament_id = t.id::text
            or tp.tournament_id = t.slug
            or tp.tournament_slug = t.slug
            or tp.tournament_slug = t.id::text
          )
      ),
      updated_at = now()
    where t.id = target_tournament.id;
  end if;

  select jsonb_build_object(
    'registered', count(*) filter (where status = 'registered'),
    'waitlist', count(*) filter (where status = 'waitlist'),
    'checkedIn', count(*) filter (where check_in_status = 'checked_in'),
    'removed', count(*) filter (where status in ('removed', 'cancelled', 'disqualified')),
    'total', count(*)
  )
    into stats_value
  from public.tournament_participants tp
  where tp.tournament_id = target_tournament.id::text
     or tp.tournament_id = target_tournament.slug
     or tp.tournament_slug = target_tournament.slug
     or tp.tournament_slug = target_tournament.id::text;

  return jsonb_build_object(
    'ok', true,
    'message', 'Inscrição atualizada.',
    'participant', to_jsonb(saved_participant),
    'stats', coalesce(stats_value, '{}'::jsonb)
  );
end;
$$;

grant execute on function public.sbw_get_tournament_participants_for_organizer(text, text) to authenticated;
grant execute on function public.sbw_update_tournament_participant_for_organizer(text, text, text, jsonb) to authenticated;

select pg_notify('pgrst', 'reload schema');
