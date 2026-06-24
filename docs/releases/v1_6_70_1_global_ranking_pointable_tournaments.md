# v1.6.70.1 — Ranking Global por torneio pontuável

## Objetivo

Corrigir a regra do Ranking Global -SBW- para seguir a decisão do projeto: torneios marcados como pontuáveis alimentam o ranking do organizador e também são elegíveis para o Ranking Global -SBW-.

## Alterações

- Remove a leitura obrigatória de aprovação/análise global como critério principal.
- O Ranking Global passa a usar torneios pontuáveis da plataforma.
- O painel público de critérios deixa de falar em “aprovados”, “em análise” e “recusados”.
- A página de Rankings explica que cada torneio pode escolher se pontua ou não.
- Mantém compatibilidade com campos existentes de ranking/pontuação.

## Arquivos alterados

- `rankings/rankings.html`
- `js/rankings/rankings-page.js`
- `js/rankings/rankings-storage.js`
- `docs/releases/v1_6_70_1_global_ranking_pointable_tournaments.md`

## Não alterado

- Não altera Supabase, Auth ou RLS.
- Não altera painel do organizador.
- Não altera criação/edição de torneio.
- Não adiciona fluxo de solicitação/aprovação global.
- Não altera bracket, check-in, inscrições ou resultados.
