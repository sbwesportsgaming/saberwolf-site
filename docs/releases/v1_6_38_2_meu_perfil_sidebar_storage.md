# v1.6.38.2 — Meu Perfil sidebar única + Storage de foto/banner

- Remove a navegação superior antiga de `perfis/meu-perfil.html`.
- Remove o hero/card grande “Meu perfil” da página de edição.
- Mantém somente a sidebar global como navegação principal.
- Mantém o sistema de enquadramento de foto/banner inspirado no fluxo de Equipes.
- Altera o caminho das mídias pessoais para `profiles/<auth_user_id>/<avatar|banner>/...` no bucket `sbw-team-assets`.
- Inclui SQL de RLS para liberar upload apenas na pasta do próprio usuário autenticado.

Antes de testar upload real, rodar no Supabase SQL Editor:

`docs/sql/v1_6_38_2_profile_assets_storage_rls.sql`
