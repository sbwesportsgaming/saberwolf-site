# v1.6.79.5 — Hotfix sidebar global e botão Administrador

## Objetivo

Corrigir a sidebar global para que a conta, foto de perfil e botão Administrador funcionem de forma consistente em todas as páginas públicas da plataforma -SBW-.

## Ajustes

- Carrega `js/core/sbw-session-context.js` nas páginas públicas que ainda usavam a sidebar sem contexto central.
- Mantém o botão Administrador visível apenas para contas com permissão administrativa.
- Remove duplicidade do botão Administrador quando o menu da conta está aberto.
- Reforça fallback via RPC `sbw_admin_panel_can_manage` quando a tabela de permissões não estiver disponível diretamente no front.
- Amplia a leitura de avatar/foto do perfil para formatos usados nos metadados do perfil.

## Páginas atualizadas

- Home
- Notícias
- Creators
- Perfis
- Rankings
- Transferências
- Loja
- Termos
- Privacidade
- Cookies

## Observação

Este patch não muda permissões. Ele apenas faz a sidebar respeitar as permissões já existentes de maneira consistente em todas as páginas.
