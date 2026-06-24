# v1.6.72.4 — Playoffs base Team Battle League 4v4

## Objetivo

Preparar a base técnica dos playoffs do formato **Team Battle League 4v4** da plataforma -SBW-, ainda sem liberar criação real do formato.

## O que foi adicionado

- Tipos de fase de playoff:
  - semifinal da divisão;
  - final da divisão;
  - semifinal da liga;
  - Grande Final;
  - disputa de terceiro lugar, reservada para uso futuro.
- Normalização de classificação por divisão.
- Seleção dos classificados por divisão.
- Geração de bracket de playoff por divisão.
- Modelo Top 3 por divisão:
  - 1º colocado aguarda na final da divisão;
  - 2º colocado enfrenta 3º colocado na semifinal;
  - vencedor da semifinal enfrenta o 1º colocado.
- Planejamento de Grande Final entre campeões de divisão.
- Placeholders seguros para vencedores de partidas anteriores.

## Observação

O **Team Battle League 4v4** continua como formato em preparação e ainda bloqueado para criação real. Esta etapa prepara apenas a estrutura técnica para uso futuro.

## Arquivo alterado

- `js/tournaments/team-battle-league.js`
