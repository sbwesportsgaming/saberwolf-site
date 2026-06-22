# v1.6.67.0 — Resultados reais e progressão Double Elimination

## Objetivo

Iniciar a fase v1.6.67 com um patch seguro no painel do organizador, focado em melhorar o fluxo real de lançamento de resultados para torneios com estrutura gerada.

## Alterações

- Double Elimination agora gera estrutura real com:
  - Winners Bracket;
  - Lower Bracket;
  - Grand Final;
  - Reset da Grand Final quando configurado.
- Resultados salvos na Winners Bracket avançam o vencedor para a próxima partida correta.
- Perdedor da Winners Bracket cai automaticamente para a Lower Bracket.
- Resultados salvos na Lower Bracket avançam o vencedor até a Lower Final.
- Vencedor da Winners Final entra na Grand Final como lado da Winners.
- Vencedor da Lower Final entra na Grand Final como lado da Lower.
- Se o lado da Lower vencer a primeira Grand Final e o reset estiver ativo, o card de Reset é preenchido automaticamente.
- Limpeza de resultado em Double Elimination agora limpa também progressões dependentes.
- Limpeza total passa a cobrir Double Elimination além de Liga e Grupos + Playoffs.
- Painel de estrutura do organizador passa a exibir Winners, Lower e Grand Final para Double Elimination.

## Arquivos alterados

- `js/tournaments/tournament-admin-page.js`
- `torneios/create-tournament/criar-torneio.html`

## Páginas para testar

- `/torneios/create-tournament/criar-torneio.html`
- `/torneios/editar-organizador.html?slug=<slug-do-organizador>`
- `/torneios/detalhe-torneio.html?id=<slug-ou-id-do-torneio>&view=chaves`
- `/torneios/detalhe-torneio.html?id=<slug-ou-id-do-torneio>&view=resultados`
- `/torneios/detalhe-torneio.html?id=<slug-ou-id-do-torneio>`

## Observações

- Não altera Supabase, Auth, RLS ou SQL.
- Não altera a bracket pública aprovada; apenas passa a alimentar melhor a estrutura real gerada pelo painel.
- O teste ideal deve ser feito com torneio real Double Elimination e participantes reais/check-in confirmado.
