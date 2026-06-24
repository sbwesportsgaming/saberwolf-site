# v1.6.72.10 — Check-in base Team Battle League 4v4

Este patch adiciona uma camada técnica inicial para o futuro check-in de equipes no formato **Team Battle League 4v4** da plataforma -SBW-.

## O que foi preparado

- Status de check-in de equipe: pendente, pronto, ausente, atrasado e revisão manual.
- Normalização de check-in por equipe.
- Validação de elenco 4v4 antes do check-in.
- Validação de escalação confirmada antes do confronto.
- Resumo geral de check-ins da liga.
- Relatório de prontidão de confrontos com base em check-in e escalações.
- Helper para anexar escalações prontas ao confronto entre equipes.

## Regra mantida

- Team Battle League 4v4 básica = divisão única.
- Team Battle League 4v4 avançada = várias divisões.

## Observação

O formato continua em preparação e ainda não foi liberado para criação real na plataforma.

## Arquivos alterados

- `js/tournaments/team-battle-league.js`
