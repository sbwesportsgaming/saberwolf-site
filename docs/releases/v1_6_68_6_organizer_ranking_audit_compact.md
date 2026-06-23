# v1.6.68.6 — Auditoria compacta na aba Rankings do organizador

## Resumo

Adiciona uma lista compacta de torneios pontuáveis recentes diretamente na aba Rankings do perfil público do organizador.

## Alterações

- Exibe a base recente usada para o ranking do organizador.
- Mostra torneio, jogo, data, temporada, campeão, resultados usados e pontos gerados.
- Mantém o ranking fora da Visão Geral.
- Não altera cálculo de pontuação, Supabase, Auth, RLS ou regras de ranking.

## Páginas principais

- `/torneios/organizador.html?slug=<slug-do-organizador>#rankings`
- `/torneios/organizador.html?slug=<slug-do-organizador>&tab=rankings`
- `/rankings/rankings.html?organizer=<slug-do-organizador>#ranking-organizador`
