# -SBW- Site v1.6.40.1 — Meu Perfil: bloqueio de enquadramento no mobile

Patch pequeno de usabilidade para a área Meu Perfil.

## Ajustes

- Foto e banner do perfil não entram mais em modo de arraste automaticamente.
- Para mover/enquadrar foto ou banner, o usuário precisa clicar em **Editar enquadramento**.
- Após salvar o enquadramento, o modo de edição é bloqueado novamente.
- O comportamento reduz alterações acidentais em celular/tablet durante a rolagem da página.
- Mantém o padrão de ajuste visual usado em Equipes, com bloqueio explícito antes de arrastar.

## Arquivos alterados

- `js/profiles/profile-admin-page.js`
- `css/profiles.css`

## Escopo preservado

- Não altera Supabase Auth.
- Não altera RLS/Storage.
- Não altera Admin, Equipes, Perfil público ou PWA.
