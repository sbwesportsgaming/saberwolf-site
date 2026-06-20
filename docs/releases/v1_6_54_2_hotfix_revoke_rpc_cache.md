# v1.6.54.2 — Hotfix remover permissão RPC/cache

## Objetivo
Corrigir o botão **Remover permissão** em Admin > Organizadores quando a RPC retornava 404 no Supabase.

## Alterações
- Adiciona chamada prioritária para `sbw_admin_revoke_organizer_permission_json`.
- Remove fallback de update direto em `organizer_permissions` pelo frontend.
- Cria RPC única com parâmetro JSONB para evitar ambiguidade de assinatura.
- Mantém compatibilidade com `sbw_admin_revoke_organizer_permission_v2`.
- Força reload do schema cache com `notify pgrst, 'reload schema'`.

## Segurança
- Apenas Admin Master/Admin SBW pode remover permissão.
- A organização já criada não é apagada.
- Apenas revoga a permissão para criar novas organizações.
