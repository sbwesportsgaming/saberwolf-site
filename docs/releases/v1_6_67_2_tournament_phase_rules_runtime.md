# v1.6.67.2 — Regras por fase aplicadas nas partidas

## Objetivo

Aplicar as regras de FT/MD por fase no fluxo real de geração e lançamento de resultados do torneio, mantendo o controle do organizador sem alterar banco de dados, Supabase, Auth ou RLS.

## Alterações principais

- As configurações de **Regras por fase** agora passam a ser aplicadas nas partidas geradas de Double Elimination.
- Cada partida pode receber `matchFormat`, `bestOf`, `phaseKey`, `phaseLabel` e `formatLabel` conforme a fase.
- A validação de placar agora usa o formato da própria partida quando disponível, em vez de usar apenas o formato geral do torneio.
- O painel de resultados mostra uma linha com a fase e o formato aplicado, por exemplo:
  - Fase inicial — MD3 / FT2
  - Top 8 — MD5 / FT3
  - Winners Final — MD5 / FT3
  - Grand Final — MD9 / FT5
- A página pública de Chaves já consegue ler os formatos por round/partida quando a estrutura é gerada com esses dados.

## Preservado

- Não altera Supabase.
- Não altera Auth.
- Não altera RLS.
- Não cria SQL.
- Não mexe na bracket pública aprovada.
- Não altera a progressão Double Elimination da v1.6.67.0, apenas adiciona formato/fase nas partidas e validação por partida.

## Páginas para testar

- `/torneios/create-tournament/criar-torneio.html`
- `/torneios/editar-organizador.html?slug=<slug-do-organizador>`
- `/torneios/detalhe-torneio.html?id=<id-ou-slug>&view=chaves`
- `/torneios/detalhe-torneio.html?id=<id-ou-slug>&view=resultados`
- `/torneios/detalhe-torneio.html?id=<id-ou-slug>&view=participantes`
