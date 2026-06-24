# v1.6.72.11 — Ciclo operacional Team Battle League 4v4

## Objetivo

Adicionar uma camada técnica para acompanhar o ciclo operacional futuro do formato **Team Battle League 4v4** dentro da plataforma -SBW-.

## Incluído

- Status operacional da liga:
  - rascunho;
  - pendente;
  - pronto;
  - em andamento;
  - partida extra necessária;
  - finalizado;
  - bloqueado.
- Diagnóstico de status por confronto.
- Diagnóstico de status por rodada.
- Diagnóstico de status por divisão.
- Relatório geral de ciclo da liga.
- Linha do tempo operacional com etapas:
  - Estrutura;
  - Inscrições;
  - Check-in;
  - Rodadas;
  - Playoffs.
- Helper para indicar a próxima ação operacional.

## Regra mantida

- **Team Battle League 4v4 básica** = uma divisão única.
- **Team Battle League 4v4 avançada** = várias divisões.

## Observações

Este patch ainda não libera o formato para criação real. Ele prepara a base para telas futuras de administração, visualização pública e acompanhamento da liga.

## Arquivos alterados

- `js/tournaments/team-battle-league.js`
- `docs/releases/v1_6_72_11_team_battle_lifecycle_timeline.md`
