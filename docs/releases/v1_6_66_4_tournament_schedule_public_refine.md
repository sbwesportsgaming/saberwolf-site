# v1.6.66.4 — Cronograma público refinado

## Objetivo

Refinar a view pública `view=cronograma` da página de detalhes do torneio, mantendo o padrão visual premium da plataforma -SBW- e deixando as etapas do torneio mais claras para jogadores, visitantes e organizadores.

## Alterações principais

- Substituída a grade simples de datas por uma linha do tempo pública.
- Adicionados estados visuais para cada etapa:
  - concluído;
  - em andamento;
  - próximo;
  - a definir.
- O cronograma agora organiza etapas como:
  - janela de inscrição;
  - check-in;
  - início do torneio;
  - geração de chaves;
  - primeiras partidas;
  - resultados e encerramento.
- Adicionado card de resumo rápido com:
  - organizador;
  - formato;
  - início;
  - check-in.
- Adicionados atalhos para:
  - inscrição;
  - participantes;
  - Ver organizador / Gerenciar organização.
- Mantida leitura tolerante de campos vindos de `tournament`, `settings`, `metadata` e estrutura gerada.

## Arquivos alterados

- `css/tournaments/tournament-detail.css`
- `js/tournaments/tournament-detail-page.js`
- `torneios/detalhe-torneio.html`
- `docs/releases/v1_6_66_4_tournament_schedule_public_refine.md`

## Páginas para testar

- `/torneios/detalhe-torneio.html?id=teste-2&view=cronograma`
- `/torneios/detalhe-torneio.html?id=teste-2&view=participantes`
- `/torneios/detalhe-torneio.html?id=teste-2&view=inscricao`
- `/torneios/detalhe-torneio.html?id=teste-2&view=chaves`
- `/torneios/detalhe-torneio.html?id=teste-2&view=resultados`
- `/torneios/detalhe-torneio.html?id=teste-2`

## Observações

- Não altera Supabase, Auth, RLS ou tabelas.
- Não altera a bracket aprovada.
- Não altera o painel do organizador.
- Não altera geração real de estrutura.
- Não altera resultados públicos já aprovados.
