# v1.6.72.15 — Cenário de teste interno Team Battle League 4v4

## Objetivo

Consolidar em um único patch uma camada de teste interno para validar a base técnica do formato **Team Battle League 4v4** antes de qualquer liberação real na criação de torneios.

## O que foi adicionado

- Geração de equipes temporárias de teste com elenco 4v4.
- Criação de cenário básico com **divisão única**.
- Simulação opcional do primeiro confronto da liga.
- Plano de resultados internos para testar pontuação 10/10/20 e partida extra quando necessário.
- Atualização de classificação após resultado simulado.
- Relatório interno consolidado com checklist de prontidão.
- Helpers públicos no namespace `window.SBWTeamBattleLeague` para validação futura pelo navegador/console.

## Regra mantida

- **Team Battle League 4v4 básica** = uma divisão única.
- **Team Battle League 4v4 avançada** = várias divisões.

## Importante

Este patch não libera criação real do formato. O Team Battle League 4v4 continua como **em preparação**.

## Arquivo alterado

```txt
js/tournaments/team-battle-league.js
```

## Validação sugerida

Como o usuário não possui Node instalado localmente, validar pelo navegador/Console. Se aparecer apenas `favicon.ico 404`, está ok.

Quando o arquivo estiver carregado em alguma página futura, será possível testar no Console com:

```js
window.SBWTeamBattleLeague.buildTeamBattleLeagueInternalTestReport()
```

O retorno esperado é um objeto com `status`, `summary`, `checks`, `nextAction` e `scenario`.

## Não alterado

- Supabase
- Auth
- RLS
- criação real de torneio
- inscrições reais
- check-in real
- bracket
- Ranking Global
- Admin Master
