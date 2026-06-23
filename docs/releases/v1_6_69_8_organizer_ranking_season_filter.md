# v1.6.69.8 — Filtro de temporada no ranking do organizador

## Objetivo

Refinar a aba pública de Rankings do organizador para permitir leitura por temporada, mantendo o ranking completo da organização em lista limpa.

## Alterações

- Adicionado filtro compacto de temporada na aba Rankings do organizador.
- O filtro permite alternar entre todas as temporadas e temporadas detectadas nos registros/torneios.
- A lista de jogadores/equipes e a auditoria de torneios pontuáveis passam a respeitar o filtro selecionado.
- Adicionado suporte inicial para abrir a página com `?season=` ou `?temporada=`.
- Atualizado cache da página pública do organizador.

## Arquivos alterados

- `torneios/organizador.html`
- `js/tournaments/tournament-organizer-page.js`
- `css/organizers/organizer-profile.css`
