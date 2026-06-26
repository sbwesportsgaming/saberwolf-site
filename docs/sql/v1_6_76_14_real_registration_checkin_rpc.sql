-- -SBW- v1.6.76.14
-- Inscrição pública e check-in público protegidos por RPC.
-- Regra preservada: conta comum não cria organização/torneio sem permissão de organizador.
-- Este SQL deve ser executado no Supabase SQL Editor antes dos testes reais.

alter table if exists public.tournaments
  add column if not exists registration_opens_at timestamptz,
  add column if not exists registration_closes_at timestamptz,
  add column if not exists checkin_starts_at timestamptz,
  add column if not exists checkin_ends_at timestamptz;

alter table if exists public.tournament_participants
  add column if not exists checked_in_at timestamptz;

create or replace function public.sbw_tournament_json_timestamptz(
  payload jsonb,
  variadic keys text[]
)
returns timestamptz
language plpgsql
stable
as $$
declare
  key text;
  raw_value text;
begin
  if payload is null then
    return null;
  end if;

  foreach key in array keys loop
    raw_value := nullif(trim(coalesce(payload #>> string_to_array(key, '.'), '')), '');

    if raw_value is not null then
      begin
        return raw_value::timestamptz;
      exception when others then
        return null;
      end;
    end if;
  end loop;

  return null;
end;
$$;


create or replace function public.sbw_recount_tournament_participants(p_tournament text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  tournament_key text := nullif(trim(coalesce(p_tournament, '')), '');
  target_tournament public.tournaments;
  active_count integer := 0;
begin
  if tournament_key is null then
    return 0;
  end if;

  select *
    into target_tournament
  from public.tournaments t
  where t.id::text = tournament_key
     or lower(t.slug) = lower(tournament_key)
  limit 1;

  if target_tournament.id is null then
    return 0;
  end if;

  select count(*)::integer
    into active_count
  from public.tournament_participants tp
  where lower(coalesce(tp.status, 'registered')) in ('registered', 'waitlist')
    and (
      tp.tournament_id = target_tournament.id::text
      or tp.tournament_id = target_tournament.slug
      or tp.tournament_slug = target_tournament.slug
      or tp.tournament_slug = target_tournament.id::text
    );

  update public.tournaments
  set current_participants = active_count,
      updated_at = now()
  where id = target_tournament.id;

  return active_count;
end;
$$;

grant execute on function public.sbw_recount_tournament_participants(text) to authenticated;

create or replace function public.sbw_register_tournament_participant(
  p_tournament text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  tournament_key text := nullif(trim(coalesce(p_tournament, '')), '');
  payload jsonb := coalesce(p_payload, '{}'::jsonb);
  target_tournament public.tournaments;
  current_profile public.profiles;
  existing_participant public.tournament_participants;
  saved_participant public.tournament_participants;
  active_count integer := 0;
  max_count integer := null;
  now_value timestamptz := now();
  status_value text := 'registered';
  allow_waitlist boolean := lower(coalesce(payload->>'allow_waitlist', 'false')) in ('true', '1', 'yes', 'sim');
  registration_open_at timestamptz;
  registration_close_at timestamptz;
  format_value text;
  player_name_value text;
  player_slug_value text;
  metadata_value jsonb := '{}'::jsonb;
begin
  if auth.uid() is null then
    raise exception 'Entre na sua conta -SBW- para se inscrever.';
  end if;

  if tournament_key is null then
    raise exception 'Torneio não informado.';
  end if;

  select *
    into target_tournament
  from public.tournaments t
  where t.id::text = tournament_key
     or lower(t.slug) = lower(tournament_key)
  limit 1;

  if target_tournament.id is null then
    raise exception 'Torneio não encontrado.';
  end if;

  format_value := lower(trim(coalesce(target_tournament.format, target_tournament.settings->>'formatKey', target_tournament.metadata->>'formatKey', '')));

  if format_value = 'team-battle-league-4v4'
     or format_value like 'team-battle%'
     or lower(coalesce(target_tournament.settings->>'formatFamily', target_tournament.metadata->>'formatFamily', '')) = 'team_battle'
     or target_tournament.settings ? 'teamBattleLeague'
     or target_tournament.settings ? 'team_battle_league'
     or target_tournament.metadata ? 'teamBattleLeague'
     or target_tournament.metadata ? 'team_battle_league'
  then
    raise exception 'Este formato usa inscrição por equipe. Use o fluxo específico do Team Battle League 4v4.';
  end if;

  if lower(coalesce(target_tournament.visibility, 'public')) not in ('public', 'published', 'unlisted') then
    raise exception 'Este torneio não está disponível para inscrição pública.';
  end if;

  if lower(coalesce(target_tournament.status, 'draft')) not in ('published', 'registration-open', 'registrations-open', 'open', 'scheduled') then
    raise exception 'As inscrições deste torneio não estão abertas.';
  end if;

  registration_open_at := coalesce(
    target_tournament.registration_opens_at,
    public.sbw_tournament_json_timestamptz(target_tournament.settings, 'registrationOpensAt', 'registration_opens_at', 'schedule.registrationOpensAt', 'schedule.registration_opens_at'),
    public.sbw_tournament_json_timestamptz(target_tournament.metadata, 'registrationOpensAt', 'registration_opens_at', 'schedule.registrationOpensAt', 'schedule.registration_opens_at')
  );

  registration_close_at := coalesce(
    target_tournament.registration_closes_at,
    public.sbw_tournament_json_timestamptz(target_tournament.settings, 'registrationClosesAt', 'registration_closes_at', 'schedule.registrationClosesAt', 'schedule.registration_closes_at'),
    public.sbw_tournament_json_timestamptz(target_tournament.metadata, 'registrationClosesAt', 'registration_closes_at', 'schedule.registrationClosesAt', 'schedule.registration_closes_at')
  );

  if registration_open_at is not null and now_value < registration_open_at then
    raise exception 'As inscrições ainda não começaram.';
  end if;

  if registration_close_at is not null and now_value > registration_close_at then
    raise exception 'As inscrições deste torneio já foram encerradas.';
  end if;

  if lower(coalesce(target_tournament.status, '')) in ('structure-generated', 'in-progress', 'running', 'finished', 'completed', 'cancelled', 'archived') then
    raise exception 'Este torneio não recebe novas inscrições neste status.';
  end if;

  select *
    into existing_participant
  from public.tournament_participants tp
  where tp.auth_user_id = auth.uid()
    and lower(coalesce(tp.status, 'registered')) in ('registered', 'waitlist')
    and (
      tp.tournament_id = target_tournament.id::text
      or tp.tournament_id = target_tournament.slug
      or tp.tournament_slug = target_tournament.slug
      or tp.tournament_slug = target_tournament.id::text
    )
  order by tp.created_at desc
  limit 1;

  if existing_participant.id is not null then
    return jsonb_build_object(
      'ok', true,
      'alreadyRegistered', true,
      'already_registered', true,
      'message', 'Você já está inscrito neste torneio.',
      'participant', to_jsonb(existing_participant)
    );
  end if;

  select *
    into current_profile
  from public.profiles p
  where p.auth_user_id = auth.uid()
     or p.id::text = auth.uid()::text
  limit 1;

  select count(*)::integer
    into active_count
  from public.tournament_participants tp
  where lower(coalesce(tp.status, 'registered')) in ('registered', 'waitlist')
    and (
      tp.tournament_id = target_tournament.id::text
      or tp.tournament_id = target_tournament.slug
      or tp.tournament_slug = target_tournament.slug
      or tp.tournament_slug = target_tournament.id::text
    );

  max_count := target_tournament.max_participants;

  if max_count is not null and max_count > 0 and active_count >= max_count then
    if allow_waitlist then
      status_value := 'waitlist';
    else
      raise exception 'O limite de participantes deste torneio foi atingido.';
    end if;
  end if;

  player_name_value := nullif(trim(coalesce(
    payload->>'player_name',
    payload->>'playerName',
    current_profile.display_name,
    current_profile.nickname,
    current_profile.username,
    'Jogador -SBW-'
  )), '');

  player_slug_value := nullif(trim(coalesce(
    payload->>'player_slug',
    payload->>'playerSlug',
    current_profile.slug,
    current_profile.username,
    ''
  )), '');

  metadata_value := coalesce(payload->'metadata', '{}'::jsonb)
    || jsonb_build_object(
      'registeredViaRpc', true,
      'registeredViaRpcAt', now_value,
      'registeredViaRpcVersion', 'v1.6.76.14',
      'authUserId', auth.uid(),
      'tournamentFormat', target_tournament.format
    );

  insert into public.tournament_participants (
    tournament_id,
    tournament_slug,
    tournament_name,
    auth_user_id,
    profile_id,
    player_name,
    player_slug,
    status,
    check_in_status,
    metadata,
    created_at,
    updated_at
  ) values (
    target_tournament.id::text,
    target_tournament.slug,
    target_tournament.title,
    auth.uid(),
    coalesce(current_profile.id::text, nullif(payload->>'profile_id', '')),
    coalesce(player_name_value, 'Jogador -SBW-'),
    coalesce(player_slug_value, ''),
    status_value,
    'pending',
    metadata_value,
    now_value,
    now_value
  ) returning * into saved_participant;

  perform public.sbw_recount_tournament_participants(target_tournament.id::text);

  return jsonb_build_object(
    'ok', true,
    'message', case when status_value = 'waitlist' then 'Torneio cheio. Você entrou na lista de espera.' else 'Inscrição confirmada.' end,
    'participant', to_jsonb(saved_participant),
    'status', status_value
  );
end;
$$;

create or replace function public.sbw_check_in_tournament_participant(
  p_tournament text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  tournament_key text := nullif(trim(coalesce(p_tournament, '')), '');
  payload jsonb := coalesce(p_payload, '{}'::jsonb);
  target_tournament public.tournaments;
  target_participant public.tournament_participants;
  saved_participant public.tournament_participants;
  now_value timestamptz := now();
  checkin_open_at timestamptz;
  checkin_close_at timestamptz;
begin
  if auth.uid() is null then
    raise exception 'Entre na sua conta -SBW- para fazer check-in.';
  end if;

  if tournament_key is null then
    raise exception 'Torneio não informado.';
  end if;

  select *
    into target_tournament
  from public.tournaments t
  where t.id::text = tournament_key
     or lower(t.slug) = lower(tournament_key)
  limit 1;

  if target_tournament.id is null then
    raise exception 'Torneio não encontrado.';
  end if;

  if lower(coalesce(target_tournament.status, 'draft')) in ('in-progress', 'running', 'finished', 'completed', 'cancelled', 'archived') then
    raise exception 'O check-in não está disponível neste status do torneio.';
  end if;

  checkin_open_at := coalesce(
    target_tournament.checkin_starts_at,
    public.sbw_tournament_json_timestamptz(target_tournament.settings, 'checkinStartsAt', 'checkInStartsAt', 'checkin_starts_at', 'schedule.checkinStartsAt', 'schedule.checkInStartsAt', 'schedule.checkin_starts_at'),
    public.sbw_tournament_json_timestamptz(target_tournament.metadata, 'checkinStartsAt', 'checkInStartsAt', 'checkin_starts_at', 'schedule.checkinStartsAt', 'schedule.checkInStartsAt', 'schedule.checkin_starts_at')
  );

  checkin_close_at := coalesce(
    target_tournament.checkin_ends_at,
    public.sbw_tournament_json_timestamptz(target_tournament.settings, 'checkinEndsAt', 'checkInEndsAt', 'checkin_ends_at', 'schedule.checkinEndsAt', 'schedule.checkInEndsAt', 'schedule.checkin_ends_at'),
    public.sbw_tournament_json_timestamptz(target_tournament.metadata, 'checkinEndsAt', 'checkInEndsAt', 'checkin_ends_at', 'schedule.checkinEndsAt', 'schedule.checkInEndsAt', 'schedule.checkin_ends_at')
  );

  if checkin_open_at is null and checkin_close_at is null then
    raise exception 'A janela de check-in ainda não foi configurada pelo organizador.';
  end if;

  if checkin_open_at is not null and now_value < checkin_open_at then
    raise exception 'O check-in ainda não começou.';
  end if;

  if checkin_close_at is not null and now_value > checkin_close_at then
    raise exception 'O check-in deste torneio já foi encerrado.';
  end if;

  select *
    into target_participant
  from public.tournament_participants tp
  where tp.auth_user_id = auth.uid()
    and lower(coalesce(tp.status, 'registered')) = 'registered'
    and (
      tp.tournament_id = target_tournament.id::text
      or tp.tournament_id = target_tournament.slug
      or tp.tournament_slug = target_tournament.slug
      or tp.tournament_slug = target_tournament.id::text
    )
  order by tp.created_at desc
  limit 1;

  if target_participant.id is null then
    raise exception 'Você precisa estar inscrito neste torneio para fazer check-in.';
  end if;

  if lower(coalesce(target_participant.check_in_status, 'pending')) = 'checked_in' then
    return jsonb_build_object(
      'ok', true,
      'alreadyCheckedIn', true,
      'already_checked_in', true,
      'message', 'Seu check-in já estava confirmado.',
      'participant', to_jsonb(target_participant)
    );
  end if;

  if lower(coalesce(target_participant.status, 'registered')) in ('removed', 'cancelled', 'disqualified') then
    raise exception 'Esta inscrição não está ativa para check-in.';
  end if;

  update public.tournament_participants
  set check_in_status = 'checked_in',
      checked_in_at = now_value,
      metadata = coalesce(target_participant.metadata, '{}'::jsonb)
        || coalesce(payload, '{}'::jsonb)
        || jsonb_build_object(
          'checkedInViaRpc', true,
          'checkedInViaRpcAt', now_value,
          'checkedInViaRpcVersion', 'v1.6.76.14',
          'checkedInByAuthUserId', auth.uid()
        ),
      updated_at = now_value
  where id = target_participant.id
  returning * into saved_participant;

  return jsonb_build_object(
    'ok', true,
    'message', 'Check-in confirmado com sucesso.',
    'participant', to_jsonb(saved_participant)
  );
end;
$$;

grant execute on function public.sbw_register_tournament_participant(text, jsonb) to authenticated;
grant execute on function public.sbw_check_in_tournament_participant(text, jsonb) to authenticated;

-- Segurança: jogador não deve alterar inscrição/check-in direto pelo Console/API.
revoke insert, update, delete on public.tournament_participants from authenticated;

-- Ajuste da criação de torneio para preservar janelas reais de inscrição/check-in.
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
  organizer_key text := trim(coalesce(payload->>'tournament_organizer_id', payload->>'organizer_id', payload->>'organizer_slug', payload->>'organizerSlug', ''));
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

  select * into target_organizer
  from public.tournament_organizers o
  where o.id::text = organizer_key or lower(o.slug) = lower(organizer_key)
  limit 1;

  if target_organizer.id is null then
    raise exception 'Organização de Torneios não encontrada.';
  end if;

  if not public.sbw_can_create_tournament_for_organizer(target_organizer.id::text)
     and not public.sbw_can_create_tournament_for_organizer(target_organizer.slug)
  then
    raise exception 'Você não tem permissão para criar torneios nesta organização.';
  end if;

  if raw_title = '' then raise exception 'Informe o nome do torneio.'; end if;
  if raw_game = '' then raise exception 'Informe o jogo do torneio.'; end if;

  if status_value not in ('draft', 'registration-open', 'open', 'published', 'scheduled', 'structure-generated', 'in-progress', 'running', 'finished', 'completed', 'cancelled', 'archived') then
    status_value := 'draft';
  end if;

  if visibility_value not in ('public', 'private', 'unlisted') then
    visibility_value := 'public';
  end if;

  select * into current_profile
  from public.profiles p
  where p.auth_user_id = auth.uid() or p.id::text = auth.uid()::text
  limit 1;

  base_slug := public.sbw_slugify(coalesce(nullif(payload->>'slug', ''), raw_title));

  loop
    slug_try := case when counter = 1 then base_slug else base_slug || '-' || counter::text end;
    exit when not exists (select 1 from public.tournaments t where t.slug = slug_try);
    counter := counter + 1;
  end loop;

  insert into public.tournaments (
    slug, title, description, rules, prize_text, game_id, game_name, platform, format, status, visibility,
    tournament_organizer_id, organizer_id, organizer_slug, organizer_name,
    max_participants, current_participants,
    registration_opens_at, registration_closes_at, checkin_starts_at, checkin_ends_at,
    starts_at, ends_at, cover_url, settings, metadata,
    created_by_auth_user_id, created_by_profile_id, created_at, updated_at
  ) values (
    slug_try, raw_title, nullif(payload->>'description', ''), nullif(payload->>'rules', ''), nullif(coalesce(payload->>'prize_text', payload->>'prizeText', ''), ''),
    coalesce(nullif(payload->>'game_id', ''), public.sbw_slugify(raw_game)), raw_game, coalesce(nullif(payload->>'platform', ''), 'crossplay'),
    coalesce(nullif(payload->>'format', ''), 'double-elimination'), status_value, visibility_value,
    target_organizer.id, target_organizer.id::text, target_organizer.slug, target_organizer.name,
    nullif(payload->>'max_participants', '')::integer, coalesce(nullif(payload->>'current_participants', '')::integer, 0),
    nullif(payload->>'registration_opens_at', '')::timestamptz,
    nullif(payload->>'registration_closes_at', '')::timestamptz,
    nullif(payload->>'checkin_starts_at', '')::timestamptz,
    nullif(payload->>'checkin_ends_at', '')::timestamptz,
    nullif(payload->>'starts_at', '')::timestamptz,
    nullif(payload->>'ends_at', '')::timestamptz,
    nullif(coalesce(payload->>'cover_url', payload->>'coverUrl', ''), ''),
    coalesce(payload->'settings', '{}'::jsonb),
    coalesce(payload->'metadata', '{}'::jsonb) || jsonb_build_object(
      'source', 'organizer-tournament-create-v1.6.76.14',
      'organizerId', target_organizer.id,
      'organizerSlug', target_organizer.slug,
      'organizerName', target_organizer.name,
      'createdByProfileSlug', coalesce(current_profile.slug, current_profile.username, '')
    ),
    auth.uid(), current_profile.id, now(), now()
  ) returning * into saved_tournament;

  return jsonb_build_object('ok', true, 'message', 'Torneio criado e vinculado à Organização de Torneios.', 'tournament', to_jsonb(saved_tournament));
end;
$$;

grant execute on function public.sbw_create_tournament_for_organizer(jsonb) to authenticated;

-- Ajuste da edição do organizador para preservar janelas reais e metadados enviados pelo painel.
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
  if auth.uid() is null then raise exception 'Entre na sua conta para editar torneios.'; end if;
  if organizer_key is null then raise exception 'Organizador não informado.'; end if;
  if tournament_key is null then raise exception 'Torneio não informado.'; end if;

  select * into target_organizer
  from public.tournament_organizers o
  where o.id::text = organizer_key or lower(o.slug) = lower(organizer_key)
  limit 1;

  if target_organizer.id is null then raise exception 'Organização de Torneios não encontrada.'; end if;

  if not public.sbw_can_manage_tournament_organizer(coalesce(target_organizer.slug, target_organizer.id::text)) then
    raise exception 'Você não tem permissão para editar torneios desta organização.';
  end if;

  select * into target_tournament
  from public.tournaments t
  where (t.id::text = tournament_key or lower(t.slug) = lower(tournament_key))
    and (
      t.tournament_organizer_id = target_organizer.id
      or t.organizer_id::text = target_organizer.id::text
      or lower(coalesce(t.organizer_slug, '')) = lower(coalesce(target_organizer.slug, ''))
    )
  limit 1;

  if target_tournament.id is null then raise exception 'Torneio não encontrado nesta organização.'; end if;

  title_value := nullif(trim(coalesce(payload->>'title', payload->>'name', target_tournament.title)), '');
  game_value := nullif(trim(coalesce(payload->>'game_name', payload->>'gameName', payload->>'game', target_tournament.game_name)), '');
  status_value := lower(nullif(trim(coalesce(payload->>'status', target_tournament.status, 'draft')), ''));
  format_value := nullif(trim(coalesce(payload->>'format', target_tournament.format, 'double-elimination')), '');

  if title_value is null then raise exception 'Informe o nome do torneio.'; end if;
  if game_value is null then raise exception 'Informe o jogo do torneio.'; end if;

  if status_value not in ('draft', 'published', 'registration-open', 'open', 'scheduled', 'structure-generated', 'in-progress', 'running', 'finished', 'completed', 'cancelled', 'archived') then
    status_value := coalesce(target_tournament.status, 'draft');
  end if;

  starts_value := case
    when payload ? 'starts_at' and nullif(payload->>'starts_at', '') is not null then nullif(payload->>'starts_at', '')::timestamptz
    when payload ? 'startDate' and nullif(payload->>'startDate', '') is not null then nullif(payload->>'startDate', '')::timestamptz
    else target_tournament.starts_at
  end;

  update public.tournaments
  set
    title = title_value,
    description = case when payload ? 'description' then coalesce(payload->>'description', '') else target_tournament.description end,
    rules = case when payload ? 'rules' then coalesce(payload->>'rules', '') else target_tournament.rules end,
    game_name = game_value,
    game_id = coalesce(nullif(payload->>'game_id', ''), target_tournament.game_id, public.sbw_slugify(game_value)),
    format = format_value,
    status = status_value,
    max_participants = case when payload ? 'max_participants' and nullif(payload->>'max_participants', '') is not null then nullif(payload->>'max_participants', '')::integer else target_tournament.max_participants end,
    registration_opens_at = case when payload ? 'registration_opens_at' then nullif(payload->>'registration_opens_at', '')::timestamptz else target_tournament.registration_opens_at end,
    registration_closes_at = case when payload ? 'registration_closes_at' then nullif(payload->>'registration_closes_at', '')::timestamptz else target_tournament.registration_closes_at end,
    checkin_starts_at = case when payload ? 'checkin_starts_at' then nullif(payload->>'checkin_starts_at', '')::timestamptz else target_tournament.checkin_starts_at end,
    checkin_ends_at = case when payload ? 'checkin_ends_at' then nullif(payload->>'checkin_ends_at', '')::timestamptz else target_tournament.checkin_ends_at end,
    starts_at = starts_value,
    cover_url = case when payload ? 'cover_url' then nullif(payload->>'cover_url', '') when payload ? 'coverUrl' then nullif(payload->>'coverUrl', '') else target_tournament.cover_url end,
    tournament_organizer_id = target_organizer.id,
    organizer_id = target_organizer.id,
    organizer_slug = target_organizer.slug,
    organizer_name = target_organizer.name,
    settings = coalesce(target_tournament.settings, '{}'::jsonb) || coalesce(payload->'settings', '{}'::jsonb),
    metadata = coalesce(target_tournament.metadata, '{}'::jsonb)
      || coalesce(payload->'metadata', '{}'::jsonb)
      || jsonb_build_object(
        'updatedFromOrganizerPanel', true,
        'updatedFromOrganizerPanelAt', now(),
        'updatedFromOrganizerPanelByAuthUserId', auth.uid(),
        'updatedFromOrganizerPanelVersion', 'v1.6.76.14'
      ),
    updated_at = now()
  where id = target_tournament.id
  returning * into saved_tournament;

  return jsonb_build_object('ok', true, 'message', 'Torneio atualizado.', 'tournament', to_jsonb(saved_tournament));
end;
$$;

grant execute on function public.sbw_update_tournament_for_organizer(text, text, jsonb) to authenticated;

select pg_notify('pgrst', 'reload schema');
