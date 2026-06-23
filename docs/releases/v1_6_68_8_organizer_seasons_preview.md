# v1.6.68.8 — Prévia de temporadas do organizador

Micropatch da fase v1.6.68.

## Objetivo

Refinar a aba **Temporadas** do perfil público do organizador sem criar nova estrutura no banco.

## Alterações

- A aba Temporadas deixa de ser apenas um estado vazio simples.
- A página tenta agrupar torneios existentes por temporada quando houver dados em `seasonName`, `season_id`, `settings` ou `metadata`.
- Exibe resumo de temporadas, torneios, torneios finalizados e pontuáveis.
- Exibe cards compactos por temporada com status, período, métricas e jogos.
- Mantém estado vazio limpo quando não houver dados.

## Observações

- Não cria temporadas reais.
- Não altera Supabase, Auth, RLS ou SQL.
- Serve como ponte visual antes da fase v1.6.69 — Temporadas reais do Organizador.
