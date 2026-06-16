# v1.6.38 — Admin: Mostrar todos os perfis

Patch pequeno e isolado para o painel Admin Master.

## Objetivo

Adicionar na aba **Usuários** do Admin Master o botão **Mostrar todos**, seguindo o padrão que já existe na aba **Equipes** com **Mostrar todas**.

## Escopo

- Não altera sidebar.
- Não altera `sbw-session-context.js`.
- Não altera permissões/RLS.
- Não altera dados do Supabase.
- Não mexe em equipes demo.
- Não mexe em upload de imagem.
- Não mexe em visual mobile/tablet.

## Arquivos alterados

- `admin/admin.html`
- `js/admin/admin-page.js`

## Comportamento esperado

Na aba **Usuários** do Admin Master:

1. O Admin pode clicar em **Mostrar todos**.
2. O painel renderiza todos os perfis carregados para a conta Admin.
3. A listagem é ordenada alfabeticamente pelo nome público.
4. A busca por perfil continua funcionando normalmente.
5. A aba **Equipes** mantém o comportamento de **Mostrar todas**.
