# v1.6.35 — Hotfix de permissões e Minha Equipe online

Base: v1.6.34 publicada.

## Objetivo

Corrigir divergência entre a conta autenticada online, permissões administrativas e a página `Minha Equipe`.

## Ajustes

- Evita que equipes demo/localStorage sejam escolhidas como `Minha Equipe` em ambiente online com Supabase ativo.
- Faz `Minha Equipe` priorizar a equipe real vinculada ao perfil atual.
- Mantém fallback local-demo apenas para ambiente local/VS Code.
- Torna a leitura de `site_permissions` mais flexível, aceitando uma ou várias linhas de permissão.
- Exibe entrada `Administrador` no menu da conta/sidebar quando a permissão administrativa real estiver ativa.
- Exibe aba `Administrador` em `Meu Perfil` quando a conta atual tiver permissão administrativa.

## Arquivos alterados

- `js/core/sbw-session-context.js`
- `js/teams/teams-storage.js`
- `js/teams/team-admin-page.js`
- `js/layout/sbw-sidebar.js`
- `js/profiles/profile-admin-page.js`
