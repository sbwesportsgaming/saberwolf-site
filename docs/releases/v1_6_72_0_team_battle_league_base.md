# v1.6.72.0 — Base técnica do Team Battle League 4v4

## Objetivo

Iniciar a etapa técnica do formato avançado **Team Battle League 4v4** sem liberar criação funcional de ligas 4v4 ainda.

## Alterações

- Criado `js/tournaments/team-battle-league.js` com constantes e helpers do formato.
- Adicionados helpers para:
  - configuração padrão 4v4;
  - divisões;
  - seed de confronto entre equipes;
  - slots de partidas principais;
  - partida extra;
  - cálculo de pontuação do confronto;
  - validação simples de elenco 4v4.
- Atualizado o catálogo central de formatos com metadados técnicos do Team Battle League 4v4:
  - `implementationKey`;
  - `schemaVersion`;
  - `helperNamespace`;
  - capacidades de partidas principais, reserva e partida extra.

## Importante

Este patch **não ativa** o Team Battle League 4v4 como formato real de criação.

O formato continua com status `planned` / `Em preparação` e permanece bloqueado pelas travas da v1.6.71.6.

## Arquivos

- `js/tournaments/tournament-formats.js`
- `js/tournaments/team-battle-league.js`
- `docs/releases/v1_6_72_0_team_battle_league_base.md`
