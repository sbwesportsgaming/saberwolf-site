# v1.6.70.7 — Minha posição no Ranking Global -SBW-

## Objetivo
Adicionar uma área pública e contextual na página de Rankings para o usuário logado acompanhar rapidamente a própria posição no Ranking Global -SBW- e a posição da equipe vinculada.

## Alterações
- Criada seção `Minha posição` na página de Rankings.
- Mostra colocação do jogador logado no recorte global atual.
- Mostra colocação da equipe vinculada quando houver equipe detectada.
- Respeita filtros globais de jogo e temporada.
- Exibe estado limpo para visitante sem login, jogador sem pontuação e equipe sem pontuação.
- Não altera cálculo de ranking, Supabase, Auth, RLS, torneios, inscrições, check-in, resultados ou bracket.

## Arquivos alterados
- `rankings/rankings.html`
- `js/rankings/rankings-page.js`
- `css/rankings.css`
