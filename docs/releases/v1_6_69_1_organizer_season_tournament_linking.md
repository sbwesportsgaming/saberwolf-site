# v1.6.69.1 — Vincular torneios à temporada e controlar pontuação

## Objetivo

Refinar a área de Temporadas no painel interno do organizador para permitir que o organizador veja quais torneios entram na temporada e controle quais contam para o ranking do organizador.

## Alterações

- Adicionado painel **Torneios da temporada** dentro da aba Temporadas.
- Lista torneios do organizador com estado de vínculo:
  - Vinculado;
  - Elegível por período;
  - Dentro do período;
  - Fora do período.
- Permite vincular torneio à temporada atual.
- Permite desvincular torneio da temporada atual.
- Permite marcar/remover torneio como pontuável para o ranking do organizador.
- Bloqueia marcação de pontuação quando o torneio não estiver vinculado ou estiver fora do período da temporada.
- Mantém check visual de torneios fora do período.
- Reforça a separação entre temporada do organizador e Ranking Global -SBW-.

## Arquivos alterados

- `torneios/editar-organizador.html`
- `js/tournaments/tournament-organizer-admin-page.js`
- `css/tournaments/tournament-organizer-admin.css`

## Observações

Este patch não altera Supabase, Auth, RLS ou SQL. Usa a função já existente de atualização de torneios pelo organizador.
