# v1.6.44.1 — Hotfix upload real: persistência de logo/banner

Este hotfix ajusta o salvamento da URL pública de logo/banner da equipe após o upload no Supabase Storage.

## Ajustes

- Usa a função RPC `sbw_update_team_asset_url` para salvar `logo_url` ou `banner_url` diretamente no banco.
- Evita falso positivo quando o arquivo sobe para o Storage, mas o link não fica persistido em `public.teams`.
- Mantém o bucket `sbw-team-assets` e as policies já configuradas.
- Não altera sidebar, RLS de outras áreas, upload visual ou perfil público.

## Observação

Antes de testar este hotfix, a função SQL `public.sbw_update_team_asset_url` precisa existir no Supabase.
