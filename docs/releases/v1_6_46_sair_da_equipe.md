# SBW v1.6.46 — Sair da equipe

## Objetivo
Adicionar uma correção pequena e segura para permitir que membros comuns saiam da própria equipe.

## Alterações
- Adiciona card **Sair desta equipe** na aba **Configurações** da Minha Equipe.
- Bloqueia a ação para capitão/dono principal, exigindo transferência de comando antes.
- Permite que membros comuns encerrem o vínculo ativo.
- Usa a função segura `public.sbw_leave_team(team_key text)` no Supabase.
- Limpa `current_team_*` no perfil quando o usuário sai da equipe atual.

## Arquivos alterados
- `js/teams/team-admin-page.js`
- `css/teams.css`
- `docs/sql/v1_6_46_leave_team.sql`
- `docs/releases/v1_6_46_sair_da_equipe.md`

## Observações
- Não altera uploads, Storage, RLS de imagens ou sidebar.
- Não permite que o capitão principal deixe a equipe sem transferir comando.
- A função usa `security definer` para evitar falso bloqueio por RLS nas tabelas internas.
