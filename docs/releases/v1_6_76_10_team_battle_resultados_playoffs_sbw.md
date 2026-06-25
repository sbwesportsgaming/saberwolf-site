# v1.6.76.10 — Resultados dos Playoffs -SBW- no Team Battle League 4v4

## Objetivo

Adicionar a etapa operacional de lançamento de resultados dos **Playoffs -SBW-** do formato **Team Battle League 4v4**.

## O que mudou

- O painel de **Playoffs 4v4** passa a permitir salvar resultados depois que a escada -SBW- for liberada.
- O organizador pode lançar vencedores e placares por set das séries finais.
- O sistema calcula pontos da série em modelo FT50/FT70.
- Quando uma série é finalizada, o vencedor avança automaticamente para a próxima etapa:
  - vencedor de 3º x 4º entra contra o 2º;
  - vencedor da semifinal entra contra o 1º na Grande Final;
  - vencedor da Grande Final vira campeão dos Playoffs -SBW-.
- A página pública passa a exibir placar, vencedor da série e campeão definido quando houver.
- Não há partida extra nos playoffs; se a meta não for atingida, o organizador adiciona/usa novo set.
- Não cria equipe fake/demo nos playoffs.

## Arquivos alterados

```txt
js/tournaments/team-battle-league.js
js/tournaments/tournament-organizer-admin-page.js
js/tournaments/tournament-detail-page.js
css/tournaments/tournament-organizer-admin.css
css/tournaments/tournament-detail.css
docs/releases/v1_6_76_10_team_battle_resultados_playoffs_sbw.md
```

## Validação sugerida

```powershell
git diff --check -- js/tournaments/team-battle-league.js js/tournaments/tournament-organizer-admin-page.js js/tournaments/tournament-detail-page.js css/tournaments/tournament-organizer-admin.css css/tournaments/tournament-detail.css docs/releases/v1_6_76_10_team_battle_resultados_playoffs_sbw.md
```

Depois testar no navegador:

```txt
Painel do organizador → Torneio Team Battle 4v4 → Playoffs 4v4
```

Fluxo esperado:

```txt
1. Liberar playoffs -SBW- após finalizar fase classificatória.
2. Reabrir Playoffs 4v4.
3. Lançar resultado da primeira série.
4. Salvar.
5. Confirmar que o vencedor avançou para a próxima série.
6. Finalizar semifinal e Grande Final.
7. Confirmar campeão na página pública.
```
