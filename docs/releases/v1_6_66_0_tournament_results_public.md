# v1.6.66.0 — Resultados e partidas públicas do torneio

## Objetivo

Criar uma área pública própria para acompanhar partidas e resultados do torneio, mantendo a bracket premium aprovada na v1.6.65 sem alterações estruturais.

## Arquivos alterados

- `torneios/detalhe-torneio.html`
- `js/tournaments/tournament-detail-page.js`
- `css/tournaments/tournament-detail.css`

## O que mudou

- Adicionada a view `view=resultados` na página pública do torneio.
- Adicionada a aba **Resultados** entre Chaves e Regras.
- Criada uma área pública com:
  - partida em andamento ou próxima partida;
  - total de partidas;
  - partidas finalizadas;
  - últimas atualizações;
  - próximas partidas;
  - últimos resultados;
  - lista geral de partidas.
- A leitura de partidas ficou mais tolerante, buscando dados em `matches`, `settings.matches`, `metadata.matches` e estruturas geradas como Winners, Lower, Grand Final, Liga, Grupos e Playoffs.

## Restrições preservadas

- Não altera Supabase.
- Não altera Auth.
- Não altera RLS.
- Não altera inscrições.
- Não altera check-in.
- Não altera geração real de estrutura.
- Não altera lançamento de resultados no painel do organizador.
- Não altera a bracket premium aprovada na v1.6.65.
