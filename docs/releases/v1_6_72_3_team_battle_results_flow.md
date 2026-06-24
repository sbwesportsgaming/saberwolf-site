# v1.6.72.3 — Resultados base Team Battle League 4v4

## Objetivo

Preparar a base técnica para registrar e calcular resultados dos confrontos do formato **Team Battle League 4v4** sem liberar o formato para criação real ainda.

## Alterações

- Adiciona helpers para atualizar resultado de cada partida individual do confronto entre equipes.
- Calcula pontos por partidas principais e partida extra.
- Detecta quando as 3 partidas principais já foram jogadas.
- Detecta empate por pontos e marca necessidade de partida extra.
- Finaliza o confronto apenas quando as partidas obrigatórias estiverem completas.
- Gera resumo público do confronto com placar, vitórias individuais e vencedor.
- Mantém o formato como `Em preparação`, respeitando a trava técnica criada na v1.6.71.6.

## Arquivos alterados

```txt
js/tournaments/team-battle-league.js
docs/releases/v1_6_72_3_team_battle_results_flow.md
```

## Observação

Este patch não altera Supabase, Auth, RLS, criação real de torneio, inscrições, check-in, bracket, Ranking Global ou Admin Master.
