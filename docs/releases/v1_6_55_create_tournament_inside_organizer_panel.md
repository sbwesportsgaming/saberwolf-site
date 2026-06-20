# v1.6.55 — Criar Torneio dentro do Painel do Organizador

## Objetivo

Reaproveitar o fluxo existente de criação de torneio, mas mover o acesso para o contexto correto: o Painel/Perfil do Organizador.

## Alterações

- Remove o botão global “Criar torneio” da sidebar comum do usuário.
- Remove o acesso global “Criar torneio” do menu legado de perfil.
- Adiciona botão “Criar Torneio” no painel de edição do organizador, visível apenas quando existe organização carregada com permissão.
- `criar-torneio.html` passa a exigir contexto de organização quando Supabase está ativo.
- A seleção de organizador mostra apenas organizações nas quais o usuário logado pode criar torneios.
- Criação real passa pela RPC `sbw_create_tournament_for_organizer`, validando permissão por organização.
- Torneios criados ficam vinculados a `tournament_organizers` por `tournament_organizer_id`, `organizer_id`, `organizer_slug` e `organizer_name`.

## Não alterado

- Inscrições de torneio.
- Rankings.
- Resultados.
- Convites/equipes.
- PWA.

## SQL

Rodar `docs/sql/v1_6_55_create_tournament_inside_organizer_panel.sql` no Supabase.
