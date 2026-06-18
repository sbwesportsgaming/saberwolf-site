-- -SBW- v1.6.50
-- Transferências + Remoção de membro
-- Objetivos:
-- 1. Exibir histórico do mercado a partir de tabelas reais conhecidas, quando existirem.
-- 2. Exibir entradas e saídas derivadas de team_members, mantendo histórico mesmo após remoção.
-- 3. Permitir que capitão/gestor remova membro real da equipe via RPC segura.

-- =========================================================
-- Remover membro da equipe
-- =========================================================
drop function if exists public.sbw_remove_team_member(text, text);

create or replace function public.sbw_remove_team_member(
  p_member_id text,
  p_team_key text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  target_team public.teams;
  target_member public.team_members;
  update_sql text;
  updated_count integer := 0;
  now_value timestamptz := now();
begin
  if auth.uid() is null then
    raise exception 'Entre na sua conta para remover membros.';
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
    raise exception 'Você não tem permissão para remover membros desta equipe.';
  end if;

  select *
    into target_member
  from public.team_members tm
  where tm.team_slug = target_team.slug
    and lower(coalesce(tm.status, 'active')) in ('active', 'ativo', 'accepted', 'confirmed')
    and (
      tm.id::text = p_member_id
      or coalesce(tm.profile_slug, '') = p_member_id
      or coalesce(tm.auth_user_id::text, '') = p_member_id
    )
  limit 1;

  if target_member.id is null then
    raise exception 'Membro ativo não encontrado nesta equipe.';
  end if;

  if lower(coalesce(target_member.role, '')) in ('owner', 'captain', 'capitao', 'capitão') then
    raise exception 'Capitão principal/dono não pode ser removido por esta ação.';
  end if;

  update_sql := 'update public.team_members set status = $1';

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'team_members'
      and column_name = 'left_at'
  ) then
    update_sql := update_sql || ', left_at = $2';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'team_members'
      and column_name = 'updated_at'
  ) then
    update_sql := update_sql || ', updated_at = $2';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'team_members'
      and column_name = 'metadata'
  ) then
    update_sql := update_sql || ', metadata = coalesce(metadata, ''{}''::jsonb) || $3::jsonb';
  end if;

  update_sql := update_sql || ' where id::text = $4 and team_slug = $5';

  execute update_sql
    using
      'removed',
      now_value,
      jsonb_build_object(
        'removedAt', now_value,
        'removedByAuthUserId', auth.uid(),
        'source', 'team-member-remove-v1.6.50-rpc'
      ),
      target_member.id::text,
      target_team.slug;

  get diagnostics updated_count = row_count;

  if updated_count = 0 then
    raise exception 'Não foi possível encerrar o vínculo do membro.';
  end if;

  update public.profiles p
  set
    current_team_id = null,
    current_team_name = null,
    current_team_slug = null
  where (
      p.auth_user_id::text = target_member.auth_user_id::text
      or p.slug = target_member.profile_slug
      or p.username = target_member.profile_slug
      or p.id::text = target_member.profile_slug
    )
    and (
      p.current_team_slug = target_team.slug
      or p.current_team_id::text = target_team.id::text
      or p.current_team_name = target_team.name
    );

  return jsonb_build_object(
    'ok', true,
    'status', 'removed',
    'teamSlug', target_team.slug,
    'memberId', target_member.id,
    'profileSlug', target_member.profile_slug,
    'message', 'Membro removido da equipe.'
  );
end;
$$;

grant execute on function public.sbw_remove_team_member(text, text) to authenticated;

-- =========================================================
-- Feed público de transferências completo
-- =========================================================
drop function if exists public.sbw_get_transfer_feed();

create or replace function public.sbw_get_transfer_feed()
returns table (
  id text,
  type text,
  status text,
  player_id text,
  player_name text,
  role text,
  game text,
  from_team_id text,
  from_team_name text,
  to_team_id text,
  to_team_name text,
  "date" text,
  description text,
  source text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  transfer_row jsonb;
  candidate_table text;
  official_sql text;
begin
  -- Histórico/manual do mercado. Aceita nomes de tabela usados em versões diferentes.
  foreach candidate_table in array array[
    'transfers',
    'transfer_history',
    'transfer_market',
    'market_transfers',
    'team_transfers'
  ] loop
    if to_regclass('public.' || candidate_table) is not null then
      official_sql := format('select to_jsonb(t) from public.%I t', candidate_table);

      if exists (
        select 1 from information_schema.columns
        where table_schema = 'public' and table_name = candidate_table and column_name = 'created_at'
      ) then
        official_sql := official_sql || ' order by created_at desc nulls last';
      elsif exists (
        select 1 from information_schema.columns
        where table_schema = 'public' and table_name = candidate_table and column_name = 'date'
      ) then
        official_sql := official_sql || ' order by date desc nulls last';
      elsif exists (
        select 1 from information_schema.columns
        where table_schema = 'public' and table_name = candidate_table and column_name = 'updated_at'
      ) then
        official_sql := official_sql || ' order by updated_at desc nulls last';
      end if;

      official_sql := official_sql || ' limit 200';

      for transfer_row in execute official_sql loop
        id := coalesce(
          transfer_row->>'id',
          transfer_row->>'slug',
          transfer_row->>'transfer_id',
          transfer_row->>'transferId',
          'market-' || candidate_table || '-' || md5(transfer_row::text)
        );
        type := coalesce(transfer_row->>'type', transfer_row->>'kind', transfer_row->>'movement_type', 'player');
        status := coalesce(transfer_row->>'status', transfer_row->>'transfer_status', transfer_row->>'transferStatus', 'confirmed');
        player_id := coalesce(transfer_row->>'player_id', transfer_row->>'playerId', transfer_row->>'profile_id', transfer_row->>'profileId', transfer_row->>'profile_slug', transfer_row->>'profileSlug', '');
        player_name := coalesce(transfer_row->>'player_name', transfer_row->>'playerName', transfer_row->>'nickname', transfer_row->>'display_name', transfer_row->>'displayName', transfer_row->>'profile_name', transfer_row->>'profileName', 'Participante');
        role := coalesce(transfer_row->>'role', transfer_row->>'position', transfer_row->>'function', transfer_row->>'function_name', transfer_row->>'public_title', '');
        game := coalesce(transfer_row->>'game', transfer_row->>'modality', transfer_row->>'category', transfer_row->>'main_game', '');
        from_team_id := coalesce(transfer_row->>'from_team_id', transfer_row->>'fromTeamId', transfer_row->>'from_team_slug', transfer_row->>'fromTeamSlug', '');
        from_team_name := coalesce(transfer_row->>'from_team_name', transfer_row->>'fromTeamName', transfer_row->>'from', 'Sem equipe');
        to_team_id := coalesce(transfer_row->>'to_team_id', transfer_row->>'toTeamId', transfer_row->>'team_slug', transfer_row->>'teamSlug', transfer_row->>'to_team_slug', transfer_row->>'toTeamSlug', '');
        to_team_name := coalesce(transfer_row->>'to_team_name', transfer_row->>'toTeamName', transfer_row->>'to', transfer_row->>'team_name', transfer_row->>'teamName', 'Sem equipe');
        "date" := coalesce(transfer_row->>'date', transfer_row->>'created_at', transfer_row->>'createdAt', transfer_row->>'updated_at', transfer_row->>'updatedAt', '');
        description := coalesce(transfer_row->>'description', transfer_row->>'summary', 'Movimentação publicada no mercado -SBW-.');
        source := candidate_table;
        return next;
      end loop;
    end if;
  end loop;

  -- Entradas em equipes: mantém histórico mesmo que depois o membro seja removido.
  return query
  with member_rows as (
    select
      to_jsonb(tm) as member_data,
      t.slug as team_public_slug,
      t.name as team_name,
      t.tag as team_tag,
      p.slug as profile_public_slug,
      p.username as profile_username,
      p.display_name as profile_display_name,
      p.nickname as profile_nickname,
      p.main_game as profile_main_game
    from public.team_members tm
    left join public.teams t
      on t.slug = tm.team_slug
    left join public.profiles p
      on p.slug = tm.profile_slug
      or p.username = tm.profile_slug
      or p.id::text = tm.profile_slug
      or p.auth_user_id::text = tm.auth_user_id::text
  )
  select
    ('member-join-' || coalesce(mr.team_public_slug, mr.member_data->>'team_slug', 'team') || '-' || coalesce(mr.profile_public_slug, mr.profile_username, mr.member_data->>'profile_slug', mr.member_data->>'id', 'profile'))::text as id,
    'player'::text as type,
    'confirmed'::text as status,
    coalesce(mr.profile_public_slug, mr.profile_username, mr.member_data->>'profile_slug', mr.member_data->>'auth_user_id', mr.member_data->>'id', '')::text as player_id,
    coalesce(mr.member_data->>'display_name', mr.member_data->>'nickname', mr.profile_display_name, mr.profile_nickname, mr.profile_username, mr.member_data->>'profile_slug', 'Jogador')::text as player_name,
    coalesce(nullif(mr.member_data->>'public_title', ''), nullif(mr.member_data->>'function_name', ''), nullif(mr.member_data->>'role', ''), 'Jogador')::text as role,
    coalesce(
      nullif(mr.profile_main_game, ''),
      case
        when jsonb_typeof(mr.member_data->'games') = 'array' and jsonb_array_length(mr.member_data->'games') > 0 then
          coalesce(mr.member_data->'games'->0->>'name', mr.member_data->'games'->0->>'id', mr.member_data->'games'->>0)
        else ''
      end,
      ''
    )::text as game,
    ''::text as from_team_id,
    'Sem equipe'::text as from_team_name,
    coalesce(mr.team_public_slug, mr.member_data->>'team_slug', '')::text as to_team_id,
    coalesce(mr.team_name, mr.member_data->'metadata'->>'teamName', mr.team_tag, mr.member_data->>'team_slug', 'Equipe')::text as to_team_name,
    coalesce(mr.member_data->>'joined_at', mr.member_data->>'created_at', mr.member_data->>'updated_at', now()::text)::text as "date",
    (
      coalesce(mr.member_data->>'display_name', mr.member_data->>'nickname', mr.profile_display_name, mr.profile_nickname, mr.profile_username, mr.member_data->>'profile_slug', 'Jogador')
      || ' entrou para '
      || coalesce(mr.team_name, mr.member_data->'metadata'->>'teamName', mr.team_tag, mr.member_data->>'team_slug', 'uma equipe')
      || '.'
    )::text as description,
    'team_members_join'::text as source
  from member_rows mr
  where coalesce(mr.member_data->>'team_slug', '') <> '';

  -- Saídas/remoções de equipes.
  return query
  with member_rows as (
    select
      to_jsonb(tm) as member_data,
      t.slug as team_public_slug,
      t.name as team_name,
      t.tag as team_tag,
      p.slug as profile_public_slug,
      p.username as profile_username,
      p.display_name as profile_display_name,
      p.nickname as profile_nickname,
      p.main_game as profile_main_game
    from public.team_members tm
    left join public.teams t
      on t.slug = tm.team_slug
    left join public.profiles p
      on p.slug = tm.profile_slug
      or p.username = tm.profile_slug
      or p.id::text = tm.profile_slug
      or p.auth_user_id::text = tm.auth_user_id::text
  )
  select
    ('member-leave-' || coalesce(mr.team_public_slug, mr.member_data->>'team_slug', 'team') || '-' || coalesce(mr.profile_public_slug, mr.profile_username, mr.member_data->>'profile_slug', mr.member_data->>'id', 'profile'))::text as id,
    'player'::text as type,
    'confirmed'::text as status,
    coalesce(mr.profile_public_slug, mr.profile_username, mr.member_data->>'profile_slug', mr.member_data->>'auth_user_id', mr.member_data->>'id', '')::text as player_id,
    coalesce(mr.member_data->>'display_name', mr.member_data->>'nickname', mr.profile_display_name, mr.profile_nickname, mr.profile_username, mr.member_data->>'profile_slug', 'Jogador')::text as player_name,
    coalesce(nullif(mr.member_data->>'public_title', ''), nullif(mr.member_data->>'function_name', ''), nullif(mr.member_data->>'role', ''), 'Jogador')::text as role,
    coalesce(nullif(mr.profile_main_game, ''), '')::text as game,
    coalesce(mr.team_public_slug, mr.member_data->>'team_slug', '')::text as from_team_id,
    coalesce(mr.team_name, mr.member_data->'metadata'->>'teamName', mr.team_tag, mr.member_data->>'team_slug', 'Equipe')::text as from_team_name,
    ''::text as to_team_id,
    'Sem equipe'::text as to_team_name,
    coalesce(mr.member_data->>'left_at', mr.member_data->>'updated_at', mr.member_data->>'created_at', now()::text)::text as "date",
    (
      coalesce(mr.member_data->>'display_name', mr.member_data->>'nickname', mr.profile_display_name, mr.profile_nickname, mr.profile_username, mr.member_data->>'profile_slug', 'Jogador')
      || ' saiu de '
      || coalesce(mr.team_name, mr.member_data->'metadata'->>'teamName', mr.team_tag, mr.member_data->>'team_slug', 'uma equipe')
      || '.'
    )::text as description,
    'team_members_leave'::text as source
  from member_rows mr
  where lower(coalesce(mr.member_data->>'status', '')) in ('left', 'removed', 'inactive', 'inativo', 'removido')
     or coalesce(mr.member_data->>'left_at', '') <> '';
end;
$$;

grant execute on function public.sbw_get_transfer_feed() to anon;
grant execute on function public.sbw_get_transfer_feed() to authenticated;
