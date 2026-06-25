# v1.6.76.3 — Agenda livre do Team Battle League 4v4

## Objetivo

Adicionar a regra operacional de que o **Team Battle League 4v4** é um campeonato mais longo e, por isso, o organizador deve ter autonomia para gerenciar datas e horários das partidas.

## Ajustes implementados

- O formato passa a carregar metadados de agenda independente:
  - `organizerManagedSchedule: true`;
  - `longFormLeague: true`;
  - `scheduleMode: organizer_per_match`;
  - `scheduleTimezone: America/Sao_Paulo`;
  - permissão para agenda por rodada;
  - permissão para agenda por confronto;
  - permissão para remarcação.
- Os confrontos do Team Battle passam a aceitar campos de agenda:
  - status da agenda;
  - data;
  - horário;
  - timezone;
  - observação;
  - link de transmissão, quando existir.
- A prévia do painel do organizador exibe um bloco de **Agenda livre de partidas**.
- A página pública exibe a regra de que a agenda é controlada pelo organizador.
- O fluxo público passa a explicar que a data inicial do torneio é referência, não uma trava única para todos os confrontos.
- O painel de criação/edição salva metadados indicando que o formato usa agenda gerenciada pelo organizador.
- Corrigido duplicado do campo `organizerTournamentEditMax` no HTML do painel do organizador.

## Regra consolidada

```txt
Team Battle League 4v4 = campeonato longo.
O organizador pode definir e remarcar datas/horários por rodada ou por confronto.
A data inicial do torneio serve como referência pública.
A classificação e os playoffs dependem dos resultados reais, não de uma agenda única obrigatória.
```

## Fora do escopo deste patch

- Banco/tabela própria para agenda de partidas.
- Editor completo de calendário por confronto.
- Notificações automáticas por data de partida.
- Integração com Google Calendar/Discord.
