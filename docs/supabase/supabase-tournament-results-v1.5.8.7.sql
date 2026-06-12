-- v1.5.8.7 — Salvar resultados reais do torneio
-- Execute depois da v1.5.8.5/v1.5.8.6.
-- Objetivo:
-- 1) Garantir que criador/gestor do torneio possa atualizar o JSONB settings com placares, partidas e tabelas.
-- 2) Reaproveitar public.sbw_can_manage_tournament criada na v1.5.8.5.
-- 3) Não cria tabela nova de partidas nesta etapa; resultados ficam em tournaments.settings.

create or replace function public.sbw_can_manage_tournament(
  p_tournament_id text,
  p_tournament_slug text default null
)
returns boolean
language plpgsql
security definer
stable
set search_path = public
as $$
declare
  v_auth_user_id uuid := auth.uid();
  v_allowed boolean := false;
begin
  if v_auth_user_id is null then
    return false;
  end if;

  select exists (
    select 1
    from public.tournaments t
    where (
      t.id::text = p_tournament_id
      or t.slug = p_tournament_id
      or t.id::text = p_tournament_slug
      or t.slug = p_tournament_slug
    )
    and t.created_by_auth_user_id = v_auth_user_id
  )
  into v_allowed;

  if v_allowed then
    return true;
  end if;

  if to_regclass('public.tournament_organizer_members') is not null then
    begin
      select exists (
        select 1
        from public.tournament_organizer_members tom
        join public.tournaments t
          on (
            t.tournament_organizer_id::text = tom.tournament_organizer_id::text
            or t.organizer_id = tom.tournament_organizer_id::text
            or t.organizer_slug = tom.organizer_slug
          )
        where (
          t.id::text = p_tournament_id
          or t.slug = p_tournament_id
          or t.id::text = p_tournament_slug
          or t.slug = p_tournament_slug
        )
        and tom.auth_user_id = v_auth_user_id
        and coalesce(tom.status, 'active') in ('active', 'approved')
        and coalesce(tom.role, 'member') in ('owner', 'admin', 'organizer', 'manager', 'staff')
      )
      into v_allowed;

      if v_allowed then
        return true;
      end if;
    exception
      when undefined_column or undefined_table then
        null;
    end;
  end if;

  return false;
end;
$$;

grant execute on function public.sbw_can_manage_tournament(text, text) to anon, authenticated;
grant select on public.tournaments to anon, authenticated;
grant update on public.tournaments to authenticated;

alter table public.tournaments enable row level security;

drop policy if exists "Tournament managers can update tournaments" on public.tournaments;
create policy "Tournament managers can update tournaments"
on public.tournaments
for update
to authenticated
using (public.sbw_can_manage_tournament(id::text, slug))
with check (public.sbw_can_manage_tournament(id::text, slug));

notify pgrst, 'reload schema';
