# v1.6.70.6 — Base pública dos torneios pontuáveis do Ranking Global

## Objetivo

Adicionar uma área pública na página de Rankings para mostrar quais torneios pontuáveis estão alimentando o Ranking Global -SBW-.

## Alterações

- Adicionada seção `ranking-global-torneios-pontuaveis`.
- Criado resumo com torneios usados, resultados, pontos de jogadores e pontos de equipes.
- Lista os torneios pontuáveis recentes do recorte global ativo.
- Exibe jogo, organizador, temporada, data, campeão quando disponível e pontos gerados.
- Mantém a regra correta: torneio pontuável conta para ranking do organizador e Ranking Global -SBW-.
- Não cria fluxo de solicitação, análise ou aprovação global.

## Arquivos alterados

- `rankings/rankings.html`
- `js/rankings/rankings-page.js`
- `css/rankings.css`

## Testes sugeridos

- Abrir `/rankings/rankings.html`.
- Conferir a nova seção “Torneios pontuáveis usados na classificação”.
- Testar filtros por jogo e temporada.
- Conferir links “Ver torneio”.
- Validar que ranking por organizador e por torneio continuam funcionando.
