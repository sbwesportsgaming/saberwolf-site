# v1.6.72.2 — Escalações base do Team Battle League 4v4

## Objetivo

Preparar a camada técnica de escalações do formato **Team Battle League 4v4** sem liberar o formato para criação real.

## O que foi adicionado

- Normalização de jogadores do elenco 4v4.
- Criação de escalação padrão a partir do elenco da equipe.
- Separação entre:
  - 3 titulares;
  - 1 reserva.
- Validação de escalação por equipe.
- Validação de escalações em confronto entre duas equipes.
- Bloqueio técnico contra jogador repetido na mesma escalação.
- Validação de que jogadores escalados pertencem ao elenco quando o elenco estiver disponível.
- Aplicação de escalações nas 3 partidas principais.
- Preparação da partida extra com os reservas, usada apenas em caso de empate.
- Helper para criar confronto entre equipes já com escalações aplicadas.

## Regra mantida

O formato continua em preparação e não deve ser liberado como criação funcional até as próximas fases.

## Arquivos alterados

```txt
js/tournaments/team-battle-league.js
```

## Validação sugerida

```bash
node --check js/tournaments/team-battle-league.js
```
