# v1.6.36 — Equipes/Admin online

## Objetivo

Corrigir inconsistências online entre:

- `Meu Perfil`, que conseguia mostrar uma equipe vinculada ao usuário.
- `Minha Equipe`, que podia não encontrar equipe gerenciável.
- `Admin Master`, que mostrava contagem de equipes, mas não tinha ação direta para listar todas.

## Ajustes

- `SBWTeamsStorage` agora possui leituras específicas para sessão/admin:
  - `getAllTeamsForSession()`
  - `getAllTeamsForAdmin()`
- Leituras públicas continuam usando o filtro público, mas aceitam equipes antigas com `is_public` nulo.
- `SBWSessionContext` passa a buscar equipes de sessão sem depender apenas de equipes públicas.
- `Minha Equipe` passa a carregar equipes da sessão/admin, reduzindo risco de perder equipes privadas ou pendentes.
- `Admin Master` ganhou botão **Mostrar todas** na aba Equipes.
- Cards de equipe no Admin mostram mais contexto: visibilidade, status e capitão quando disponível.
- Cards de equipe no Admin ganharam link **Gerenciar**, apontando para `minha-equipe.html?id=...`.

## Observação importante

Se a equipe aparecer em `Meu Perfil`, mas o usuário não conseguir gerenciar, a causa provável pode ser banco de dados:

- equipe existe, mas `team_members` não tem o usuário como `captain`, `owner`, `manager` ou `admin`;
- equipe existe, mas `captain_user_id` / `captain_profile_slug` não aponta para o perfil correto;
- equipe foi criada com `is_public = false` ou `null`, e páginas antigas estavam consultando apenas equipes públicas;
- RLS permite contar/ler parcialmente, mas bloqueia leitura completa em alguma tabela.

Este patch melhora a leitura e o diagnóstico visual, mas vínculos incorretos no Supabase ainda precisam ser corrigidos no banco.
