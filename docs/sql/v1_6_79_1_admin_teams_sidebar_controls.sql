-- =========================================================
-- v1.6.79.1 — Admin Master: ações seguras em equipes
-- Plataforma -SBW-
-- =========================================================
-- Objetivo:
-- - permitir ao Admin Master executar exclusão administrativa segura de equipes;
-- - preservar histórico/auditoria no metadata da equipe;
-- - não remover fisicamente a linha do banco durante testes reais.
-- =========================================================

-- ---------------------------------------------------------
-- RPC: ação administrativa segura em equipe
-- ---------------------------------------------------------
drop function if exists public.sbw_admin_manage_team(text, text, text);

create or replace function public.sbw_admin_manage_team(
  p_team text,
  p_action text,
  p_reason text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  target_row public.teams;
  normalized_action text := lower(trim(coalesce(p_action, '')));
  previous_status text;
  previous_visibility boolean;
  previous_active boolean;
  next_metadata jsonb;
begin
  if not public.sbw_is_platform_admin() then
    raise exception 'Apenas Admin Master/Admin SBW pode executar ações administrativas em equipes.';
  end if;

  if nullif(trim(coalesce(p_team, '')), '') is null then
    raise exception 'Equipe não informada.';
  end if;

  if normalized_action not in ('delete') then
    raise exception 'Ação administrativa inválida para equipe: %', p_action;
  end if;

  select *
    into target_row
  from public.teams t
  where t.id::text = trim(p_team)
     or t.slug = trim(p_team)
  limit 1;

  if target_row.id is null then
    raise exception 'Equipe não encontrada.';
  end if;

  previous_status := coalesce(target_row.status, 'active');
  previous_visibility := coalesce(target_row.is_public, true);
  previous_active := coalesce(target_row.is_active, true);

  next_metadata := coalesce(target_row.metadata, '{}'::jsonb)
    || jsonb_build_object(
      'adminLastAction', jsonb_build_object(
        'action', normalized_action,
        'previousStatus', previous_status,
        'previousVisibility', previous_visibility,
        'previousActive', previous_active,
        'reason', nullif(p_reason, ''),
        'adminAuthUserId', auth.uid(),
        'at', now()
      ),
      'adminManaged', true,
      'adminDeleted', true
    );

  update public.teams
     set is_active = false,
         is_public = false,
         is_verified = false,
         verification_status = 'not_verified',
         member_limit = 50,
         status = 'deleted',
         metadata = next_metadata,
         updated_at = now()
   where id = target_row.id
   returning * into target_row;

  return jsonb_build_object(
    'ok', true,
    'action', normalized_action,
    'message', 'Equipe excluída do painel público com segurança.',
    'team', to_jsonb(target_row)
  );
end;
$$;

grant execute on function public.sbw_admin_manage_team(text, text, text) to authenticated;

notify pgrst, 'reload schema';
