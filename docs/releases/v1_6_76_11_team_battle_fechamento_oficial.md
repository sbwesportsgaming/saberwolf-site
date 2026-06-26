# v1.6.76.11 — Fechamento oficial do Team Battle League 4v4

Este patch adiciona o fechamento operacional do **Team Battle League 4v4** após os Playoffs -SBW-.

## Objetivo

Permitir que o organizador encerre oficialmente o campeonato longo depois que a Grande Final dos Playoffs -SBW- estiver finalizada.

## O que foi adicionado

- Resumo final técnico do Team Battle League 4v4.
- Identificação de campeão, vice, 3º e 4º lugar a partir da escada -SBW-.
- Card de pódio no painel do organizador.
- Botão **Finalizar Team Battle 4v4** quando o campeão já estiver definido.
- Salvamento de `finalResults` e `final_results` em `settings` e `metadata`.
- Status final do bloco `teamBattleLeague` como `finished`.
- Página pública com pódio final quando a Grande Final estiver concluída.
- Compatibilidade com o fluxo de ranking por temporadas, pois o torneio passa a ter dados finais oficiais.

## Regras mantidas

- Nome do formato continua **Team Battle League 4v4**.
- A fase final usa nomenclatura própria: **Playoffs -SBW-**.
- Sem uso público de nomes externos; a fase final aparece como Playoffs -SBW-.
- Sem equipe fake/demo.
- O pódio só aparece quando a Grande Final tem vencedor real.

## Arquivos alterados

```txt
js/tournaments/team-battle-league.js
js/tournaments/tournament-organizer-admin-page.js
js/tournaments/tournament-detail-page.js
css/tournaments/tournament-organizer-admin.css
css/tournaments/tournament-detail.css
docs/releases/v1_6_76_11_team_battle_fechamento_oficial.md
```
