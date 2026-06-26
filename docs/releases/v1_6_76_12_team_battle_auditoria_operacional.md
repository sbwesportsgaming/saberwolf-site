# v1.6.76.12 — Auditoria operacional do Team Battle League 4v4

Este patch adiciona histórico interno para as ações operacionais do **Team Battle League 4v4**.

## Objetivo

Dar mais segurança para campeonatos longos, registrando as principais alterações feitas pelo organizador no fluxo 4v4.

## O que foi adicionado

- Auditoria operacional interna do Team Battle League 4v4.
- Registro automático ao salvar:
  - agenda livre dos confrontos;
  - resultados da fase classificatória;
  - liberação dos Playoffs -SBW-;
  - resultados dos Playoffs -SBW-;
  - fechamento oficial do torneio.
- Histórico salvo em `teamBattleLeague.auditLog` e `teamBattleLeague.audit_log`.
- Bloco visual de auditoria nos painéis de Agenda 4v4, Resultados 4v4 e Playoffs 4v4.
- Limite interno de 40 registros recentes para evitar crescimento excessivo dos metadados.
- Helpers públicos no módulo `SBWTeamBattleLeague` para normalizar e consultar auditoria.

## Regras mantidas

- Nome do formato continua **Team Battle League 4v4**.
- Fase final continua como **Playoffs -SBW-**.
- Nenhuma referência pública externa é adicionada.
- A auditoria é operacional/interna, não uma área pública para jogadores.
- Sem equipe fake/demo.

## Arquivos alterados

```txt
js/tournaments/team-battle-league.js
js/tournaments/tournament-organizer-admin-page.js
css/tournaments/tournament-organizer-admin.css
docs/releases/v1_6_76_12_team_battle_auditoria_operacional.md
```
