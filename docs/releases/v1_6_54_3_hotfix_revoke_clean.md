# v1.6.54.3 — Hotfix remover permissão sem fallback antigo

Correção focada no botão **Remover permissão** do Admin > Organizadores.

## Ajustes

- `revokeOrganizerPermission()` agora aceita `permission_id` como identificador suficiente.
- Remove tentativas antigas de RPC com overload (`sbw_admin_revoke_organizer_permission` e `v2`) no fluxo principal.
- O Admin chama somente `sbw_admin_revoke_organizer_permission_json`.
- Remove fallback direto de REST/update para evitar erro 400 e esconder a causa real.
- Versiona o carregamento de `admin-page.js` em `admin.html` com `?v=1.6.54.3`, reduzindo risco de cache antigo no GitHub Pages/navegador.

## Não altera

- Organizações já criadas.
- Supabase Auth.
- Equipes.
- Convites.
- Transferências.
- PWA.
