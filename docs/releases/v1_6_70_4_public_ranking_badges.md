# v1.6.70.4 — Selos públicos de ranking nos torneios

Este patch adiciona indicadores públicos para deixar claro quando um torneio pontua para ranking na plataforma -SBW-.

## O que mudou

- A listagem pública de torneios agora exibe selo de ranking no card:
  - `Pontuável` para torneios que contam para o ranking do organizador e para o Ranking Global -SBW-.
  - `Não pontuável` para torneios recreativos/exibição sem pontuação.
- A página pública do torneio agora mostra o status de ranking:
  - no hero do torneio;
  - no resumo lateral;
  - na Visão Geral;
  - nas informações principais.
- A regra exibida segue a definição atual do projeto:
  - torneio pontuável entra no ranking do organizador e é elegível para o Ranking Global -SBW-;
  - torneio não pontuável aparece normalmente, mas não gera pontos.

## Arquivos alterados

- `torneios/torneios.html`: sem alteração neste patch.
- `js/tournaments/tournaments-list-page.js`
- `js/tournaments/tournament-detail-page.js`
- `css/torneios.css`
- `css/tournaments/tournament-detail.css`

## Observações

- Não altera Supabase, Auth, RLS ou SQL.
- Não altera criação/edição de torneio, inscrições, check-in, resultados ou bracket.
- O patch é apenas visual/informativo para páginas públicas.
