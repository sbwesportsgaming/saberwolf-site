# v1.6.69.4 — Filtros nos torneios da temporada

Micropatch da fase v1.6.69.

## Alterações

- Adiciona busca por nome, jogo ou data no painel interno de torneios da temporada.
- Adiciona filtros rápidos: Todos, Vinculados, Pontuáveis, Aptos e Fora do período.
- Mantém ações de vincular/desvincular e marcar pontuável no mesmo painel.
- Não altera Supabase, Auth, RLS, SQL, ranking, inscrições, check-in ou resultados.

## Páginas para testar

- `/torneios/editar-organizador.html?slug=<slug-do-organizador>#organizerEditorSeasons`
- `/torneios/organizador.html?slug=<slug-do-organizador>#seasons`
