# v1.6.40.2 — Meu Perfil com fórmula de enquadramento da equipe

## Objetivo
Ajustar a edição de foto e banner do Meu Perfil para seguir visual e comportamento mais próximos do painel Minha Equipe, evitando arraste acidental no mobile/tablet.

## Arquivos alterados
- `js/profiles/profile-admin-page.js`
- `css/profiles.css`

## Ajustes
- Reorganiza a área de foto/banner em blocos separados, como banner/logo em Minha Equipe.
- Banner do perfil passa a ter prévia maior e mais confortável.
- Foto do perfil passa a ter bloco de edição próprio, similar ao logo da equipe.
- Mantém bloqueio por padrão no mobile/tablet: rolar a página não deve mover foto/banner.
- Para reposicionar, o usuário precisa clicar em “Editar enquadramento”.
- Botões de zoom e salvar enquadramento ficam bloqueados enquanto a edição não estiver ativa.
- Após salvar o enquadramento, a edição volta a ficar bloqueada.

## Observações
- Não altera Supabase, Storage, RLS, Auth, Admin, Equipes nem PWA.
- Não mexe na regra de tag da equipe nem no botão “Minha equipe” no perfil público da equipe; esses itens ficam para patch posterior.
