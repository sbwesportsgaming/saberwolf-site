# v1.6.72.14 — Consolidação administrativa e pública Team Battle League 4v4

Esta versão consolida a base técnica do formato **Team Battle League 4v4** para reduzir a fragmentação dos próximos patches e preparar uma camada mais útil para telas futuras.

## O que foi consolidado

- Modelo único de disponibilidade do formato.
- Comparativo entre:
  - **Team Battle League 4v4 básica**: divisão única;
  - **Team Battle League 4v4 avançada**: várias divisões.
- Resumo de regras do formato:
  - equipes com 4 jogadores;
  - 3 titulares;
  - 1 reserva;
  - 3 partidas principais;
  - partida extra em caso de empate;
  - pontuação 10 / 10 / 20 + extra 10.
- Modelo administrativo para futura prévia no painel do organizador.
- Modelo público para futura seção explicativa do formato no torneio.
- Plano de implementação agrupado para próximos blocos funcionais.
- Modelo consolidado que junta metadados, visão pública, visão administrativa e roadmap técnico.

## Regra mantida

```txt
Team Battle League 4v4 básica = uma divisão única
Team Battle League 4v4 avançada = várias divisões
```

A primeira versão funcional deve priorizar o modo básico com divisão única. O modo avançado com várias divisões fica reservado para etapa posterior.

## Importante

O formato continua como **em preparação**.

Este patch não libera criação real, não altera banco de dados e não conecta o formato a inscrições reais, check-in real ou resultados públicos funcionais.

## Arquivos alterados

```txt
js/tournaments/team-battle-league.js
```

## Validação sugerida

Como o ambiente local pode não ter Node instalado, validar pelo navegador/Console. Se aparecer apenas `favicon.ico 404`, está ok.
