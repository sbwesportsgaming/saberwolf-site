# v1.6.71.1 — Catálogo público de formatos avançados

## Objetivo

Conectar a base central de formatos competitivos às páginas públicas de torneios e deixar visível que a plataforma -SBW- já possui formatos ativos e formatos avançados planejados.

## Alterações

- A página pública de Torneios passou a carregar o registro central `SBWTournamentFormats`.
- A página pública de detalhe do torneio passou a carregar o registro central `SBWTournamentFormats`.
- A leitura de formato agora reconhece metadados salvos em `metadata.format`, `metadata.tournamentFormat`, `settings.formatMeta` e campos equivalentes.
- O label público do formato passa a usar o catálogo central quando disponível.
- A faixa pública de formatos em `/torneios/torneios.html` agora mostra:
  - Grupos + Playoffs;
  - Double Elimination;
  - Liga / Pontos Corridos;
  - Team Battle League 4v4 como formato planejado.
- Adicionado visual discreto para formato planejado, sem liberar criação funcional do Team Battle 4v4 ainda.

## Não implementado nesta etapa

- Divisões;
- escalações;
- confrontos por equipe;
- rodadas avançadas;
- playoffs de liga 4v4;
- lógica funcional do Team Battle League 4v4.

## Testes sugeridos

- Abrir `/torneios/torneios.html` e conferir a faixa de formatos.
- Abrir `/torneios/detalhe-torneio.html?id=<id-ou-slug>` e conferir se o formato continua aparecendo corretamente.
- Validar torneios antigos com Double Elimination, Grupos + Playoffs e Liga/Pontos Corridos.
