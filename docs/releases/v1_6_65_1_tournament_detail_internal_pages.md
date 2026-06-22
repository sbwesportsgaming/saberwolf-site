# -SBW- v1.6.65.1 — Detalhe do Torneio com áreas internas por página

## Objetivo

Refinar a página pública de detalhe do torneio após o visual premium de chaves, separando melhor as áreas internas e evitando que a navegação de abas acompanhe a rolagem do site.

## Alterações

- Remove comportamento sticky da navegação interna do torneio.
- Transforma as abas em links de página por `view=`:
  - `view=visao-geral`
  - `view=cronograma`
  - `view=participantes`
  - `view=chaves`
  - `view=regras`
  - `view=inscricao`
- Mantém a mesma página HTML, mas cada área passa a ter URL própria.
- Centraliza cards como Sobre o torneio, Legenda, Próxima partida, Últimos resultados, Datas e Informações do torneio na Visão geral.
- Deixa Cronograma isolado em sua própria área.
- Deixa Participantes isolado em sua própria área.
- Deixa Chaves/bracket isolado em sua própria área.
- Deixa Regras exibindo apenas as regras publicadas pelo organizador.
- Deixa Inscrição isolada como área de participação do jogador cadastrado na plataforma -SBW-.
- Participantes agora exibem todos os inscritos antes do fechamento do check-in.
- Após fechamento do check-in, a lista passa a priorizar somente participantes com check-in confirmado.
- Prepara estado visual para check-in público quando a janela estiver aberta.

## Arquivos alterados

- `js/tournaments/tournament-detail-page.js`
- `css/tournaments/tournament-detail.css`

## Observações

- Não altera Supabase, Auth, RLS ou geração de estrutura.
- Não cria novas tabelas.
- Não cria dados falsos.
- A confirmação real de check-in público pode ser conectada em uma próxima etapa específica caso seja necessário criar RPC/política para o jogador confirmar presença.
