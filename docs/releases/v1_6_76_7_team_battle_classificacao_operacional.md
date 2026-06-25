# v1.6.76.7 — Classificação operacional do Team Battle League 4v4

Este patch ajusta a classificação do **Team Battle League 4v4** para funcionar como uma liga longa com resultados lançados pelo organizador.

## Objetivo

Garantir que a tabela da Divisão Única seja calculada somente a partir de confrontos oficialmente finalizados.

## Regras consolidadas

- Resultado parcial não altera a classificação oficial.
- Confronto ao vivo não altera a classificação oficial.
- Confronto adiado, cancelado ou a definir não altera a classificação oficial.
- Folga técnica continua sem pontuação.
- Somente confronto finalizado pelo organizador entra na tabela.
- Playoffs -SBW- continuam bloqueados até todos os confrontos reais da fase classificatória estarem finalizados.

## Alterações técnicas

- Adicionado verificador de confronto oficial para classificação.
- Adicionado resumo operacional da classificação:
  - total de confrontos;
  - confrontos oficializados;
  - confrontos parciais;
  - confrontos pendentes;
  - confrontos ao vivo;
  - confrontos com partida extra necessária;
  - bloqueio/liberação dos playoffs.
- `calculateDivisionStandings` agora ignora resultados parciais por padrão.
- A página pública mostra o status da classificação oficial.
- O painel do organizador mostra o progresso da classificação e reforça que apenas finalizados contam.

## Arquivos alterados

```txt
js/tournaments/team-battle-league.js
js/tournaments/tournament-detail-page.js
js/tournaments/tournament-organizer-admin-page.js
css/tournaments/tournament-detail.css
css/tournaments/tournament-organizer-admin.css
docs/releases/v1_6_76_7_team_battle_classificacao_operacional.md
```

## Validação recomendada

No PowerShell, sem Node.js:

```powershell
git diff --check -- js/tournaments/team-battle-league.js js/tournaments/tournament-detail-page.js js/tournaments/tournament-organizer-admin-page.js css/tournaments/tournament-detail.css css/tournaments/tournament-organizer-admin.css docs/releases/v1_6_76_7_team_battle_classificacao_operacional.md
```

Depois testar no navegador:

- abrir página pública de torneio Team Battle 4v4;
- abrir painel do organizador;
- lançar resultado parcial;
- confirmar que a classificação oficial não muda até finalizar o confronto;
- finalizar confronto;
- confirmar atualização da tabela;
- verificar que playoffs seguem aguardando todos os confrontos finalizados.
