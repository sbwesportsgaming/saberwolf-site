-- v1.5.8.4 — Gestão de inscrições reais pelo organizador
-- Execute depois do SQL da v1.5.8.3.
-- Objetivo:
-- 1) Permitir que o criador/gestor do torneio atualize check-in/status dos inscritos.
-- 2) Manter jogadores autenticados restritos à própria inscrição.
-- 3) Recarregar schema da API REST do Supabase.

create or replace function public.sbw_can_manage_tournament_registration(
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

  -- Criador original do torneio pode gerenciar as inscrições.
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

  -- Compatibilidade com membros de Organização de Torneio.
  -- Se a estrutura tiver nomes de colunas diferentes, o bloco é ignorado sem quebrar o deploy.
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

grant execute on function public.sbw_can_manage_tournament_registration(text, text) to anon, authenticated;

alter table public.tournament_participants enable row level security;

grant select on public.tournament_participants to anon, authenticated;
grant insert, update, delete on public.tournament_participants to authenticated;

-- Recria as policies principais com nomes estáveis.
drop policy if exists "tournament_participants_public_read" on public.tournament_participants;
create policy "tournament_participants_public_read"
on public.tournament_participants
for select
to anon, authenticated
using (
  status in ('registered', 'waitlist')
  or auth.uid() = auth_user_id
  or public.sbw_can_manage_tournament_registration(tournament_id, tournament_slug)
);

drop policy if exists "tournament_participants_insert_own" on public.tournament_participants;
create policy "tournament_participants_insert_own"
on public.tournament_participants
for insert
to authenticated
with check (
  auth.uid() = auth_user_id
  and status in ('registered', 'waitlist')
);

-- Jogador ainda pode alterar a própria inscrição ativa; fluxos públicos serão refinados depois.
-- Se o organizador remover/desclassificar, o jogador não consegue reativar a própria linha.
drop policy if exists "tournament_participants_update_own" on public.tournament_participants;
create policy "tournament_participants_update_own"
on public.tournament_participants
for update
to authenticated
using (
  auth.uid() = auth_user_id
  and status in ('registered', 'waitlist')
)
with check (
  auth.uid() = auth_user_id
  and status in ('registered', 'waitlist', 'cancelled')
);

-- Criador/gestor do torneio pode fazer check-in, remover, colocar em waitlist etc.
drop policy if exists "tournament_participants_update_manager" on public.tournament_participants;
create policy "tournament_participants_update_manager"
on public.tournament_participants
for update
to authenticated
using (public.sbw_can_manage_tournament_registration(tournament_id, tournament_slug))
with check (public.sbw_can_manage_tournament_registration(tournament_id, tournament_slug));

-- Delete físico fica restrito ao dono da própria inscrição nesta fase.
-- A remoção pelo organizador usa status='removed' para preservar histórico/auditoria.
drop policy if exists "tournament_participants_delete_own" on public.tournament_participants;
create policy "tournament_participants_delete_own"
on public.tournament_participants
for delete
to authenticated
using (auth.uid() = auth_user_id);

notify pgrst, 'reload schema';
