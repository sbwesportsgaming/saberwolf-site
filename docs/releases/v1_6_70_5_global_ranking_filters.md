# v1.6.70.5 — Filtros públicos do Ranking Global -SBW-

## Resumo

Este patch adiciona filtros públicos ao Ranking Global -SBW-, mantendo a regra central da fase v1.6.70:

> Torneio pontuável alimenta o ranking do organizador e também o Ranking Global -SBW-.

## O que mudou

- Adicionado bloco de filtros do Ranking Global na página `rankings/rankings.html`.
- Filtro por jogo.
- Filtro por temporada.
- Atualização dos Top jogadores, Top equipes, cards de resumo e painel de critério global conforme o recorte selecionado.
- Suporte a parâmetros na URL:
  - `?game=<jogo>` ou `?jogo=<jogo>`
  - `?season=<temporada>` ou `?temporada=<temporada>`
- O filtro global não altera o Ranking por organizador nem o Ranking por torneio.

## Arquivos alterados

- `rankings/rankings.html`
- `js/rankings/rankings-page.js`
- `css/rankings.css`

## Testes sugeridos

1. Abrir `/rankings/rankings.html`.
2. Conferir se o bloco "Recorte do Ranking Global -SBW-" aparece acima do painel de critério global.
3. Trocar o filtro de jogo.
4. Trocar o filtro de temporada.
5. Conferir se os cards de jogadores, equipes e torneios pontuáveis atualizam.
6. Conferir se o Ranking por organizador continua funcionando separadamente.
7. Testar com URL parametrizada, por exemplo:
   - `/rankings/rankings.html?game=Street%20Fighter%206`
   - `/rankings/rankings.html?season=2026`

## Observação

Não altera Supabase, Auth, RLS, torneios, inscrições, check-in, resultados ou bracket.
