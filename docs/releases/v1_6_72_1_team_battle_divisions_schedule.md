# v1.6.72.1 — Divisões e calendário base do Team Battle League 4v4

Este patch aprofunda a base técnica do formato **Team Battle League 4v4** sem liberar criação real do formato ainda.

## O que foi adicionado

- Normalização de equipes do formato 4v4.
- Criação de divisões a partir de equipes.
- Geração base de rodadas round-robin por divisão.
- Criação automática de confrontos entre equipes dentro da divisão.
- Base de classificação da divisão com:
  - posição;
  - confrontos disputados;
  - vitórias/derrotas por confronto;
  - empates;
  - pontos de batalha;
  - saldo de pontos;
  - vitórias individuais.
- Ajuste da pontuação padrão das partidas principais para o modelo planejado:
  - Partida 1: 10 pts;
  - Partida 2: 10 pts;
  - Partida 3: 20 pts;
  - Partida extra: 10 pts.

## Arquivo alterado

- `js/tournaments/team-battle-league.js`

## Observação

O **Team Battle League 4v4** continua como formato em preparação. Este patch apenas amplia a base técnica para divisões, calendário e classificação futura.

Não altera Supabase, Auth, RLS, criação real de torneio, inscrições, check-in, resultados, bracket, Ranking Global ou Admin Master.
