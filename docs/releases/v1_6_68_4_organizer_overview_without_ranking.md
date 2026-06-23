# v1.6.68.4 — Visão Geral do organizador sem ranking

## Objetivo

Remover o bloco de ranking da Visão Geral do perfil público do organizador, mantendo ranking completo somente na aba Rankings e na página geral de Rankings.

## Ajustes

- Removido o card de Ranking da Visão Geral do organizador.
- A Visão Geral passa a focar em torneios e métricas do organizador.
- O ranking completo permanece disponível na aba Rankings.
- Evita quebra visual em telas menores ou quando os cards de ranking têm poucos dados.
- Atualizado cache busting da página do organizador.

## Arquivos alterados

- `torneios/organizador.html`
- `js/tournaments/tournament-organizer-page.js`
- `css/organizers/organizer-profile.css`

## Páginas para testar

- `/torneios/organizador.html?slug=<slug-do-organizador>`
- `/torneios/organizador.html?slug=<slug-do-organizador>` na aba Rankings
- `/rankings/rankings.html?organizer=<slug-do-organizador>#ranking-organizador`

## Observação

Não altera cálculo de ranking, Supabase, Auth, RLS, torneios, inscrições, check-in ou progressão de resultados.
