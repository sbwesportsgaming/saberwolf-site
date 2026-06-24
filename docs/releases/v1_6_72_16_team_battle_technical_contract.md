# v1.6.72.16 — Contrato técnico Team Battle League 4v4

Este patch consolida a fase técnica do **Team Battle League 4v4** com um contrato de integração para as próximas telas e fluxos.

## O que entrou

- Contrato técnico do formato com entidades esperadas.
- Chaves de armazenamento planejadas em `metadata`/`settings`.
- Checklist de pré-liberação para próxima integração visual/administrativa.
- Plano agrupado das próximas etapas, evitando novos micropatches excessivos.
- Reforço da regra:
  - **Team Battle League 4v4 básica** = Divisão Única.
  - **Team Battle League 4v4 avançada** = várias divisões.

## Novos helpers

- `buildTeamBattleLeagueIntegrationContract()`
- `buildTeamBattleLeaguePreReleaseChecklist()`
- `buildTeamBattleLeagueNextImplementationBatches()`

## Importante

Este patch **não libera criação real** do formato.

O Team Battle League 4v4 continua como **em preparação**. A próxima etapa recomendada é usar esse contrato para uma prévia administrativa/visual controlada no painel do organizador antes de qualquer fluxo real de inscrição, check-in ou resultado.
