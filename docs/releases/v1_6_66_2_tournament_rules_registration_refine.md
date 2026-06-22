# v1.6.66.2 — Regras públicas e inscrição/check-in refinado

## Objetivo

Refinar visualmente as áreas públicas de **Regras** e **Inscrição** da página pública do torneio, mantendo intactas as rotinas já validadas de Supabase, Auth, RLS, inscrição real, check-in, bracket, resultados e painel do organizador.

## Alterações

- Nova apresentação da view `view=regras` com:
  - card principal de regulamento público;
  - renderização mais limpa de parágrafos e listas;
  - estado vazio quando o organizador ainda não publicou regras;
  - resumo competitivo lateral com formato, organizador, check-in e premiação;
  - botão rápido para ver/gerenciar organizador.

- Refinamento da view `view=inscricao` com:
  - introdução mais clara do estado da inscrição;
  - fluxo visual do participante: conta, inscrição, check-in, chaves/partidas;
  - card de orientação contextual;
  - card específico de status do check-in;
  - manutenção dos botões de inscrição/check-in e acesso rápido ao organizador.

## Arquivos alterados

- `torneios/detalhe-torneio.html`
- `js/tournaments/tournament-detail-page.js`
- `css/tournaments/tournament-detail.css`
- `docs/releases/v1_6_66_2_tournament_rules_registration_refine.md`

## Páginas para testar

- `/torneios/detalhe-torneio.html?id=teste-2&view=regras`
- `/torneios/detalhe-torneio.html?id=teste-2&view=inscricao`
- `/torneios/detalhe-torneio.html?id=teste-2`
- `/torneios/detalhe-torneio.html?id=teste-2&view=chaves`
- `/torneios/detalhe-torneio.html?id=teste-2&view=resultados`

## Observações

- Não altera a lógica da bracket aprovada.
- Não altera o painel do organizador.
- Não altera tabelas, RLS ou funções Supabase.
- O check-in público continua preparado visualmente; a confirmação real deve ser validada em etapa própria quando o fluxo de atualização no Supabase for ativado para jogadores.
