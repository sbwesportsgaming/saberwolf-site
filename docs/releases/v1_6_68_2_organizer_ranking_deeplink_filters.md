# v1.6.68.2 — Ranking completo do organizador e filtros por URL

## Objetivo

Refinar a fase de Ranking real do Organizador, conectando o perfil público do organizador à página geral de rankings da plataforma -SBW-.

## Alterações

- Adicionado atalho **Ver ranking completo** nos blocos de ranking do perfil público do organizador.
- O atalho abre `/rankings/rankings.html?organizer=<organizador>#ranking-organizador`.
- A página de Rankings agora lê parâmetros de URL para iniciar filtros automaticamente.
- Suporte inicial para parâmetros:
  - `organizer` / `organizador`;
  - `tournament` / `torneio`;
  - `search` / `busca` / `q`.
- O seletor de organizador aceita slug/nome vindo da URL, mesmo quando o valor ainda não estiver listado no select.
- O card de ranking por organizador passa a exibir o nome público do organizador quando possível.
- Atualizado cache busting de `rankings-storage.js`, `rankings-page.js`, `tournament-organizer-page.js` e CSS relacionado.

## Arquivos alterados

- `rankings/rankings.html`
- `js/rankings/rankings-page.js`
- `torneios/organizador.html`
- `js/tournaments/tournament-organizer-page.js`
- `css/organizers/organizer-profile.css`
- `css/rankings.css`

## Observações

Não altera Supabase, Auth, RLS, SQL, progressão de torneio, inscrições, check-in, bracket pública ou regras de pontuação.
