# v1.6.69.9 — Busca e ordenação no ranking do organizador

Micropatch de refinamento da aba **Rankings** no perfil público do organizador.

## Ajustes

- Adiciona busca por jogador/equipe.
- Adiciona filtro rápido entre Jogadores, Equipes e Todos.
- Adiciona ordenação por Pontos, Nome e Participações.
- Mantém o filtro de temporada da v1.6.69.8.
- Mantém a lista preparada para exibir participantes com pontuação e participantes com 0 pts.

## Arquivos alterados

- `torneios/organizador.html`
- `js/tournaments/tournament-organizer-page.js`
- `css/organizers/organizer-profile.css`

## Páginas para testar

- `/torneios/organizador.html?slug=<slug-do-organizador>#rankings`
- `/torneios/organizador.html?slug=<slug-do-organizador>&tab=rankings`
- `/torneios/organizador.html?slug=<slug-do-organizador>&tab=rankings&season=<nome-da-temporada>`
