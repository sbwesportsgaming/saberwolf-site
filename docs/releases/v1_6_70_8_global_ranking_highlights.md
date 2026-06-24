# v1.6.70.8 — Destaques do Ranking Global -SBW-

## Objetivo

Adicionar uma visão rápida e limpa dos principais destaques do Ranking Global -SBW-, sem mudar a regra de pontuação e sem criar fluxo de aprovação global.

## Alterações

- Criada seção pública `Destaques do recorte` na página de Rankings.
- Exibe líder entre jogadores, líder entre equipes, jogo mais movimentado, organizador mais ativo e último torneio pontuável usado no ranking.
- Os destaques respeitam os filtros globais de jogo e temporada.
- Os cards de jogador/equipe/torneio possuem links diretos quando há dados disponíveis.
- Mantida a regra: torneio pontuável alimenta ranking do organizador e Ranking Global -SBW-.

## Arquivos alterados

- `rankings/rankings.html`
- `js/rankings/rankings-page.js`
- `css/rankings.css`

## Testes sugeridos

- Abrir `/rankings/rankings.html`.
- Alterar filtro de jogo e temporada.
- Conferir se os destaques atualizam junto com Top jogadores, Top equipes, Minha posição e torneios pontuáveis.
