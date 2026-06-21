# v1.6.60.5 — Hotfix temporadas, staff e torneios editáveis

## Ajustes
- Corrige erro ao salvar temporada quando a RPC tentava gravar `name` como `null` em `tournament_organizers`.
- Garante que o payload de temporada preserve nome, descrição, logo, banner, links, jogos e metadata atual do organizador.
- Adiciona ação **Gerenciar** nos torneios listados no painel interno do organizador.
- Mantém ação **Ver** para abrir a página pública do torneio.
- Ajusta CSS das ações de torneio.
- Corrige constraint de cargos em `tournament_organizer_members` para aceitar `owner`, `admin`, `manager`, `staff`, `member`, `organizer_admin` e `tournament_admin`.
- Garante colunas `display_name` e `avatar_url` na tabela de staff.

## SQL obrigatório
Rodar `docs/sql/v1_6_60_5_hotfix_seasons_staff_roles.sql` no Supabase.
