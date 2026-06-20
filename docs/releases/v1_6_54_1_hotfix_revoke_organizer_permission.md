# v1.6.54.1 — Hotfix remover permissão de organizador

## Objetivo
Corrigir o botão **Remover permissão** na aba Organizadores do Admin Master.

## Alterações
- Adiciona RPC `sbw_admin_revoke_organizer_permission_v2` com parâmetros em texto para evitar falha por assinatura/UUID.
- Mantém compatibilidade com as assinaturas anteriores de `sbw_admin_revoke_organizer_permission`.
- Atualiza o JS do Admin para tentar a RPC v2 primeiro.
- Mantém fallback seguro para a assinatura v1.6.54, assinatura v1.6.52 e update direto via RLS quando permitido.
- Não remove organizações já criadas; apenas revoga a permissão de criar novas organizações.

## Arquivos
- `js/admin/admin-page.js`
- `docs/sql/v1_6_54_1_hotfix_revoke_organizer_permission.sql`
- `docs/releases/v1_6_54_1_hotfix_revoke_organizer_permission.md`

## Teste
1. Rodar o SQL no Supabase.
2. Abrir Admin Master > Organizadores.
3. Clicar em Remover permissão.
4. Confirmar que o usuário some da lista de permissões ativas.
5. Confirmar que a organização já criada não foi apagada.
