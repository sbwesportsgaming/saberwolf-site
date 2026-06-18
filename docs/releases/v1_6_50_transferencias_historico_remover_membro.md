# v1.6.50 — Transferências com histórico e remoção real de membro

## Objetivo
Corrigir dois pontos do fluxo real de equipes/mercado:

- a página Transferências deve manter o histórico do mercado e também exibir entradas reais vindas de `team_members`;
- o botão de remover membro da equipe deve funcionar no Supabase, não apenas localmente.

## Arquivos alterados

- `js/transfers/transfers-page.js`
- `js/teams/team-admin-page.js`
- `js/teams/teams-storage.js`
- `docs/sql/v1_6_50_transferencias_historico_remover_membro.sql`

## SQL
Cria/atualiza:

- `public.sbw_remove_team_member(text, text)`
- `public.sbw_get_transfer_feed()`

## Observações

- A remoção real encerra o vínculo ativo em `team_members` com status `removed`.
- A função também limpa `current_team_*` do perfil removido quando o perfil ainda aponta para a equipe.
- Transferências passa a exibir entradas e saídas baseadas no histórico de `team_members`.
- O feed tenta preservar tabelas reais de mercado com nomes conhecidos: `transfers`, `transfer_history`, `transfer_market`, `market_transfers` e `team_transfers`.
- Não altera convites, aceite de convite, criação de equipe, Auth ou RLS existente.
