# v1.6.76.2 — Folga automática no Team Battle League 4v4

## Objetivo

Programar a montagem da Divisão Única do Team Battle League 4v4 para funcionar corretamente quando a quantidade real de equipes confirmadas no check-in for ímpar.

## O que mudou

- A geração round-robin agora identifica quantidade ímpar de equipes.
- O sistema adiciona uma folga técnica interna para organizar as rodadas.
- A folga não cria equipe fake, equipe demo, placeholder ou participante real.
- Cada rodada pode carregar uma lista `byes` com as equipes em descanso.
- A classificação continua considerando apenas confrontos reais.
- A folga não gera pontos, vitória, derrota, empate ou saldo.
- A página pública mostra a folga como aviso visual: equipe em descanso na rodada.
- O painel do organizador também exibe a folga técnica quando houver quantidade ímpar.

## Regra consolidada

```txt
Capacidade do torneio: número par.
Equipes confirmadas no check-in: podem terminar em número ímpar.
Rodadas: usam folga técnica quando necessário.
Classificação: ignora folgas.
Playoffs -SBW-: continuam usando Top 4 real da Divisão Única.
```

## Exemplo

```txt
7 equipes confirmadas
+ 1 folga técnica interna
= 7 rodadas

Em cada rodada:
- 3 confrontos reais
- 1 equipe em folga
```

## Arquivos alterados

```txt
js/tournaments/team-battle-league.js
js/tournaments/tournament-detail-page.js
js/tournaments/tournament-organizer-admin-page.js
css/tournaments/tournament-detail.css
css/tournaments/tournament-organizer-admin.css
docs/releases/v1_6_76_2_team_battle_folga_automatica.md
```

## Validação sugerida

- Criar/usar teste com 5 ou 7 equipes confirmadas.
- Conferir se a Divisão Única gera rodadas sem equipe fake.
- Conferir se cada rodada tem apenas confrontos reais e uma folga.
- Conferir se a classificação não soma ponto para folga.
- Conferir página pública e painel do organizador.
