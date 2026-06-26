# v1.6.76.4 — Agenda editável do Team Battle League 4v4

## Objetivo

Adicionar ao painel do organizador uma área real para gerenciar datas e horários dos confrontos do **Team Battle League 4v4**.

Esse formato é uma liga longa, então o organizador não deve ficar preso ao horário único do torneio. A data inicial serve como referência pública, enquanto cada confronto pode ter sua própria agenda.

## O que foi implementado

- Botão **Agenda 4v4** nos torneios Team Battle League 4v4 do painel do organizador.
- Painel próprio de agenda por confronto.
- Campos por confronto:
  - data;
  - horário;
  - status;
  - link de transmissão;
  - observação pública.
- Salvamento dos dados de agenda em `settings.teamBattleLeague` e `metadata.teamBattleLeague`.
- Preservação de resultados/slots já existentes ao salvar agenda.
- Agenda pública preparada para ser lida pelos componentes do Team Battle.
- Página pública passa a exibir observação e link de transmissão quando definidos no confronto.
- Nenhuma equipe fake/demo é criada para montar agenda.

## Regra consolidada

```txt
Team Battle League 4v4 = campeonato longo.
Organizador controla datas e horários por confronto.
Data inicial do torneio = referência pública.
Cada confronto pode ter agenda própria.
Remarcações ficam sob controle do organizador.
```

## Arquivos alterados

```txt
js/tournaments/team-battle-league.js
js/tournaments/tournament-detail-page.js
js/tournaments/tournament-organizer-admin-page.js
css/tournaments/tournament-detail.css
css/tournaments/tournament-organizer-admin.css
torneios/editar-organizador.html
docs/releases/v1_6_76_4_team_battle_agenda_editavel.md
```
