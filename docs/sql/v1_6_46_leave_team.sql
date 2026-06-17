-- SBW v1.6.46 - Sair da equipe
-- Cria uma função segura para um membro sair da própria equipe.
-- Capitão/dono principal não pode sair por esta função.

create or replace function public.sbw_leave_team(team_key text)
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
begin
  select *
    into target_team
  from public.teams
  where slug = team_key or id::text = team_key
  limit 1;

  if target_team.id is null then
    raise exception 'Equipe não encontrada: %', team_key;
  end if;

  select *
    into target_member
  from public.team_members
  where team_slug = target_team.slug
    and auth_user_id::text = auth.uid()::text
    and lower(coalesce(status, '')) in ('active', 'ativo', 'accepted', 'confirmed')
  limit 1;

  if target_member.team_slug is null then
    raise exception 'Vínculo ativo não encontrado para esta equipe.';
  end if;

  if lower(coalesce(target_member.role, '')) in ('owner', 'captain', 'capitao', 'capitão') then
    raise exception 'Capitão principal/dono não pode sair antes de transferir o comando da equipe.';
  end if;

  update_sql := 'update public.team_members set status = $1';

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'team_members'
      and column_name = 'left_at'
  ) then
    update_sql := update_sql || ', left_at = now()';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'team_members'
      and column_name = 'updated_at'
  ) then
    update_sql := update_sql || ', updated_at = now()';
  end if;

  update_sql := update_sql || '
    where team_slug = $2
      and auth_user_id::text = $3
      and lower(coalesce(status, '''')) in (''active'', ''ativo'', ''accepted'', ''confirmed'')';

  execute update_sql using 'left', target_team.slug, auth.uid()::text;
  get diagnostics updated_count = row_count;

  if updated_count = 0 then
    raise exception 'Não foi possível encerrar o vínculo ativo.';
  end if;

  update public.profiles
  set
    current_team_id = null,
    current_team_name = null,
    current_team_slug = null
  where auth_user_id::text = auth.uid()::text
    and (
      current_team_slug = target_team.slug
      or current_team_id::text = target_team.id::text
      or current_team_name = target_team.name
    );

  return jsonb_build_object(
    'ok', true,
    'teamSlug', target_team.slug,
    'status', 'left'
  );
end;
$$;

grant execute on function public.sbw_leave_team(text) to authenticated;
