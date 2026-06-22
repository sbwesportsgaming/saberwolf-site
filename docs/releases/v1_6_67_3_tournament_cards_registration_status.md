# v1.6.67.3 — Status real de inscrição nos cards de torneio

## Objetivo

Corrigir a listagem pública de torneios para que o botão do card reflita o status real do usuário logado no torneio.

## Alterações

- A página `/torneios/torneios.html` agora consulta a inscrição real do usuário logado para cada torneio carregado.
- O botão secundário do card passa a exibir:
  - `Inscrever-se` quando o usuário ainda não está inscrito;
  - `Fazer check-in` quando o usuário já está inscrito e ainda não confirmou presença;
  - `Check-in confirmado` quando a inscrição já tem check-in confirmado;
  - `Detalhes` quando o torneio não está aberto para inscrição e o usuário não está inscrito.
- O badge do card agora mostra `Inscrito`, `Lista de espera` ou `Check-in confirmado` quando aplicável.
- O link de inscrição/check-in direciona para `view=inscricao` no detalhe público do torneio.
- Adicionado cache busting no CSS e JS da página de torneios.

## Arquivos alterados

- `torneios/torneios.html`
- `css/torneios.css`
- `js/tournaments/tournaments-list-page.js`

## Observações

Não altera Supabase, Auth, RLS, SQL, progressão da Double Elimination ou página pública da bracket.
