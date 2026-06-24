# v1.6.72.6 — Diagnóstico de prontidão Team Battle League 4v4

Este patch adiciona uma camada técnica de diagnóstico para o formato planejado **Team Battle League 4v4** da plataforma -SBW-.

## Objetivo

Preparar uma validação segura da estrutura da liga antes de liberar o formato para criação real.

## O que foi adicionado

- Validação de divisões.
- Validação de equipes por divisão.
- Diagnóstico de elenco 4v4.
- Detecção de equipe duplicada.
- Validação de calendário round-robin.
- Detecção de confrontos duplicados.
- Detecção de mandante/visitante fora da divisão.
- Relatório de prontidão da liga.
- Próximos passos automáticos para completar a configuração.

## Helpers adicionados

- `validateDivisionTeams`
- `validateDivisionSchedule`
- `validateTeamBattleLeagueStructure`
- `getTeamBattleLeagueNextSetupSteps`
- `buildTeamBattleLeagueReadinessReport`

## Importante

O Team Battle League 4v4 continua como formato em preparação.

Este patch não libera criação real do formato e não altera Supabase, Auth, RLS, ranking, inscrições, check-in, resultados ou bracket.
