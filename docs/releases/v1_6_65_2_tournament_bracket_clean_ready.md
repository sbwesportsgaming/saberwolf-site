# -SBW- v1.6.65.2 — Bracket limpa e pré-montada

## Objetivo

Refinar a área **Chaves** da página pública do torneio, removendo o aspecto de caixa pesada e deixando a bracket mais limpa, no mesmo padrão visual já aprovado em outras páginas da plataforma -SBW-.

## O que mudou

- Remove o visual de caixa/painel pesado envolvendo a bracket na página Chaves.
- Mantém busca por jogador/equipe.
- Mantém zoom, centralizar e arrastar bracket.
- A bracket passa a aparecer mesmo sem inscritos ou sem estrutura real gerada.
- Double Elimination exibe Winners Bracket, Lower Bracket e Grand Final preparados visualmente.
- Lower Bracket também fica preparada a partir das oitavas/R16 quando ainda não há estrutura real.
- Groups + Playoffs mantém bracket vertical/bottom-up preparada das oitavas até a final.
- Antes do fechamento do check-in, a bracket mostra slots “A definir”.
- Após o fechamento do check-in, os nomes entram usando apenas participantes com check-in confirmado.
- Se houver mais participantes confirmados que o tamanho base de R16, a bracket expande automaticamente para R32, R64 etc.
- Remove informações redundantes da área Chaves, mantendo os cards de contexto na Visão geral.

## Arquivos alterados

- `js/tournaments/tournament-detail-page.js`
- `css/tournaments/tournament-detail.css`

## Observações

Esta versão não altera Supabase, Auth, RLS, inscrições, resultados ou geração real de estrutura. É um refinamento visual e de fallback da exibição pública da bracket.
