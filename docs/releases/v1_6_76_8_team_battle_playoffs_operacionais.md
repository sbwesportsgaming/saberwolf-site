# v1.6.76.8 — Playoffs operacionais -SBW- do Team Battle League 4v4

## Objetivo

Adicionar uma etapa operacional para liberar os playoffs -SBW- do **Team Battle League 4v4** a partir do Top 4 real da Divisão Única.

## O que mudou

- Adicionada função central para calcular o estado operacional dos playoffs:
  - fase classificatória incompleta;
  - confrontos finalizados/total;
  - Top 4 disponível;
  - escada -SBW- pronta para liberação;
  - playoffs já salvos pelo organizador.
- Adicionado botão **Playoffs 4v4** no painel de torneios do organizador.
- Criado painel de playoffs no admin do organizador.
- O painel mostra:
  - status de liberação;
  - bloqueios atuais;
  - progresso da fase classificatória;
  - Top 4 classificado;
  - escada -SBW-;
  - regras públicas da fase final.
- O botão de liberação só fica ativo quando:
  - há equipes reais confirmadas;
  - todos os confrontos reais da Divisão Única foram finalizados;
  - existe Top 4 real na classificação.
- Ao liberar, o sistema salva em `settings.teamBattleLeague` e `metadata.teamBattleLeague`:
  - `playoffs`;
  - `playoffPlan` / `playoff_plan`;
  - `playoffPreview` / `playoff_preview`;
  - `playoffsStatus` / `playoffs_status`;
  - `playoffsUnlockedAt` / `playoffs_unlocked_at`.

## Regras consolidadas

- Sem equipe fake/demo nos playoffs.
- Playoffs usam Top 4 real da Divisão Única.
- Escada -SBW-:
  - 3º x 4º;
  - vencedor enfrenta o 2º;
  - vencedor enfrenta o 1º na Grande Final.
- Quartas e Semifinal em FT50.
- Grande Final em FT70.
- Sem partida extra nos playoffs -SBW-.

## Arquivos alterados

```txt
js/tournaments/team-battle-league.js
js/tournaments/tournament-organizer-admin-page.js
css/tournaments/tournament-organizer-admin.css
torneios/editar-organizador.html
docs/releases/v1_6_76_8_team_battle_playoffs_operacionais.md
```

## Validação recomendada

```powershell
git diff --check -- js/tournaments/team-battle-league.js js/tournaments/tournament-organizer-admin-page.js css/tournaments/tournament-organizer-admin.css torneios/editar-organizador.html docs/releases/v1_6_76_8_team_battle_playoffs_operacionais.md
```

Depois testar no navegador:

1. Abrir painel do organizador.
2. Conferir se torneio Team Battle 4v4 mostra botão **Playoffs 4v4**.
3. Abrir antes de finalizar todos os confrontos e confirmar que aparece bloqueado.
4. Finalizar a fase classificatória.
5. Abrir **Playoffs 4v4** e conferir Top 4 + escada -SBW-.
6. Liberar playoffs e conferir página pública.
