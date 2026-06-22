# v1.6.67.4 — Tela de resultados do organizador mais segura

## Objetivo

Preparar o painel do organizador para testes reais de resultados, com avisos e travas visuais antes de lançar placares, especialmente em Double Elimination.

## Alterações

- Adicionado painel de validação antes da área de resultados.
- O painel mostra:
  - origem dos dados: Supabase/inscrições reais ou local/teste;
  - partidas concluídas;
  - partidas pendentes;
  - partidas aguardando jogadores;
  - modo de check-in;
  - resumo das regras por fase.
- Cards de resultado agora mostram um estado de segurança:
  - pronta para resultado;
  - resultado lançado;
  - aguardando jogador.
- Confirmação reforçada antes de salvar resultado em Double Elimination.
- Confirmação reforçada ao editar partida já concluída.
- Confirmação reforçada ao limpar resultados que podem ter progressão dependente.
- Confirmação reforçada ao limpar todos os resultados.
- Atualizado cache do script do painel de criação/gestão.

## Não alterado

- Supabase.
- Auth.
- RLS.
- SQL.
- Página pública da bracket.
- Página pública de torneios.
- Progressão Double Elimination criada na v1.6.67.0.

## Páginas para testar

- `/torneios/create-tournament/criar-torneio.html`
- `/torneios/editar-organizador.html?slug=<slug-do-organizador>`
- `/torneios/detalhe-torneio.html?id=<id-ou-slug>&view=chaves`
- `/torneios/detalhe-torneio.html?id=<id-ou-slug>&view=resultados`
- `/torneios/detalhe-torneio.html?id=<id-ou-slug>&view=participantes`
