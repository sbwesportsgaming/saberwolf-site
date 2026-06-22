# v1.6.65.9 — Refinamento da Grand Final na bracket

Patch pontual para a visualização pública de Chaves/Bracket da página do torneio.

## Ajustes

- Limpou o card da Grand Final, removendo a caixa extra pesada e mantendo o visual mais próximo dos cards da bracket.
- Reduziu a duplicação visual de textos dentro da Grand Final.
- Forçou o alinhamento vertical da Grand Final com a Winners Final.
- Manteve a conexão entre Winners Final, Lower Final e Grand Final.

## Arquivos alterados

- `css/tournaments/tournament-detail.css`
- `js/tournaments/tournament-detail-page.js`
- `torneios/detalhe-torneio.html`

## Observação

Este patch não altera Supabase, Auth, RLS, inscrições, check-in, geração real de estrutura, resultados ou painel do organizador.
