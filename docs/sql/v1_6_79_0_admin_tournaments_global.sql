-- =========================================================
-- v1.6.79.0 — Admin Master: gestão global de torneios
-- Plataforma -SBW-
-- =========================================================
-- Objetivo:
-- - permitir ao Admin Master listar todos os torneios da plataforma;
-- - executar ações administrativas seguras sem depender do painel do organizador;
-- - preservar histórico/auditoria no metadata do torneio;
-- - não conceder esse poder a organizadores comuns.
--
-- Observação importante:
-- A ação "delete" aqui é exclusão administrativa segura/soft delete:
-- status = deleted, visibility = private e metadata.adminDeleted = true.
-- Ela não remove fisicamente a linha nem apaga histórico de participantes/resultados.
-- =========================================================

-- ---------------------------------------------------------
-- RPC: lista global de torneios para Admin Master/Admin SBW
-- ---------------------------------------------------------
drop function if exists public.sbw_admin_list_tournaments();

create or replace function public.sbw_admin_list_tournaments()
returns setof jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.sbw_is_platform_admin() then
    raise exception 'Apenas Admin Master/Admin SBW pode listar todos os torneios.';
  end if;

  return query
  select
    to_jsonb(t)
    || jsonb_build_object(
      'participant_count', coalesce(p.total, 0),
      'checked_in_count', coalesce(p.checked_in, 0),
      'admin_view_source', 'sbw_admin_list_tournaments'
    )
  from public.tournaments t
  left join lateral (
    select
      count(*)::int as total,
      count(*) filter (where lower(coalesce(tp.check_in_status, '')) in ('checked_in', 'checked-in', 'confirmed'))::int as checked_in
    from public.tournament_participants tp
    where tp.tournament_id::text = t.id::text
       or coalesce(tp.tournament_slug, '') = coalesce(t.slug, '')
  ) p on true
  order by coalesce(t.created_at, t.starts_at, now()) desc;
end;
$$;

grant execute on function public.sbw_admin_list_tournaments() to authenticated;

-- ---------------------------------------------------------
-- RPC: ação administrativa segura em torneio
-- ---------------------------------------------------------
drop function if exists public.sbw_admin_manage_tournament(text, text, text);

create or replace function public.sbw_admin_manage_tournament(
  p_tournament text,
  p_action text,
  p_reason text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  target_row public.tournaments;
  normalized_action text := lower(trim(coalesce(p_action, '')));
  previous_status text;
  previous_visibility text;
  next_status text;
  next_visibility text;
  next_metadata jsonb;
begin
  if not public.sbw_is_platform_admin() then
    raise exception 'Apenas Admin Master/Admin SBW pode executar ações administrativas em torneios.';
  end if;

  if nullif(trim(coalesce(p_tournament, '')), '') is null then
    raise exception 'Torneio não informado.';
  end if;

  if normalized_action not in ('draft', 'hide', 'publish', 'archive', 'delete', 'restore') then
    raise exception 'Ação administrativa inválida: %', p_action;
  end if;

  select *
    into target_row
  from public.tournaments t
  where t.id::text = trim(p_tournament)
     or t.slug = trim(p_tournament)
  limit 1;

  if target_row.id is null then
    raise exception 'Torneio não encontrado.';
  end if;

  previous_status := coalesce(target_row.status, 'draft');
  previous_visibility := coalesce(target_row.visibility, 'public');
  next_status := previous_status;
  next_visibility := previous_visibility;

  if normalized_action = 'draft' then
    next_status := 'draft';
    next_visibility := 'private';
  elsif normalized_action = 'hide' then
    next_visibility := 'private';
  elsif normalized_action = 'publish' then
    next_visibility := 'public';
    if previous_status in ('draft', 'archived', 'deleted', 'hidden', 'cancelled') then
      next_status := 'published';
    end if;
  elsif normalized_action = 'archive' then
    next_status := 'archived';
    next_visibility := 'private';
  elsif normalized_action = 'restore' then
    next_status := 'draft';
    next_visibility := 'public';
  elsif normalized_action = 'delete' then
    next_status := 'deleted';
    next_visibility := 'private';
  end if;

  next_metadata := coalesce(target_row.metadata, '{}'::jsonb)
    || jsonb_build_object(
      'adminLastAction', jsonb_build_object(
        'action', normalized_action,
        'previousStatus', previous_status,
        'previousVisibility', previous_visibility,
        'nextStatus', next_status,
        'nextVisibility', next_visibility,
        'reason', nullif(p_reason, ''),
        'adminAuthUserId', auth.uid(),
        'at', now()
      ),
      'adminManaged', true,
      'adminDeleted', normalized_action = 'delete'
    );

  update public.tournaments
     set status = next_status,
         visibility = next_visibility,
         metadata = next_metadata,
         updated_at = now()
   where id = target_row.id
   returning * into target_row;

  return jsonb_build_object(
    'ok', true,
    'action', normalized_action,
    'message', case normalized_action
      when 'draft' then 'Torneio marcado como rascunho.'
      when 'hide' then 'Torneio ocultado da área pública.'
      when 'publish' then 'Torneio publicado/reativado.'
      when 'archive' then 'Torneio arquivado.'
      when 'delete' then 'Torneio excluído do painel público com segurança.'
      when 'restore' then 'Torneio restaurado como rascunho público.'
      else 'Ação administrativa concluída.'
    end,
    'tournament', to_jsonb(target_row)
  );
end;
$$;

grant execute on function public.sbw_admin_manage_tournament(text, text, text) to authenticated;

notify pgrst, 'reload schema';
