# v1.6.68.3 — Auditoria do ranking do organizador

## Objetivo

Refinar a página de Rankings da plataforma -SBW- para que o ranking por organizador mostre não só o Top de jogadores/equipes, mas também a base de torneios que gerou aquela pontuação.

## Alterações

- Adicionada seção **Torneios pontuáveis recentes** dentro do ranking por organizador.
- Cada torneio exibe:
  - nome do torneio;
  - jogo;
  - data de finalização;
  - temporada, quando disponível;
  - campeão, quando disponível;
  - soma de pontos de jogadores;
  - soma de pontos de equipes;
  - quantidade de resultados usados;
  - link rápido para abrir o torneio.
- Adicionada seção resumida de **regras aplicadas** para jogadores e equipes.
- Reforçada a regra de equipes: somente o melhor colocado da equipe por torneio conta para a pontuação da equipe.
- Atualizado cache busting da página de Rankings para `v=1.6.68.3`.

## Arquivos alterados

- `rankings/rankings.html`
- `js/rankings/rankings-page.js`
- `css/rankings.css`

## Páginas para testar

- `/rankings/rankings.html?organizer=<slug-do-organizador>#ranking-organizador`
- `/rankings/rankings.html?organizador=<nome-do-organizador>#ranking-organizador`
- `/rankings/rankings.html`
- `/torneios/organizador.html?slug=<slug-do-organizador>`

## Observações

Este patch não altera Supabase, Auth, RLS, SQL, regras de pontuação, progressão de torneio, inscrições, check-in ou bracket pública. É um refinamento de visualização/auditoria do ranking por organizador.
