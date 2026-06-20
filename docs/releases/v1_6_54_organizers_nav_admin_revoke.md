# v1.6.54 — Organizadores na navegação, Admin e remoção de permissão

## Objetivo

Transformar Organizadores em uma área própria de navegação e corrigir a remoção de permissão para criar Organização de Torneios.

## Alterações

- Adiciona **Organizadores** na sidebar global, depois de Equipes e antes de Torneios.
- Cria a página pública `/organizadores/organizadores.html`.
- A página lista organizações reais de `tournament_organizers`.
- A página mostra a porta “Criar organização” somente para conta com permissão real.
- Adiciona a aba **Organizadores** no Admin Master.
- A aba Admin lista somente usuários que já têm permissão ativa em `organizer_permissions`.
- Corrige a remoção da permissão usando RPC mais tolerante.
- A remoção pode encontrar a permissão por id, `auth_user_id`, `profile_id` ou `profile_slug`.

## Não altera

- Não cria torneio.
- Não altera convites de equipe.
- Não altera Transferências.
- Não apaga organizações já criadas.
- Não concede poder sobre outras organizações.

## SQL

Rode `docs/sql/v1_6_54_organizers_nav_admin_revoke.sql` no Supabase após a v1.6.52.
