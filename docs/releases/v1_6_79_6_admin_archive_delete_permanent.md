# v1.6.79.6 — Admin Master: arquivar e excluir definitivo

## Objetivo

Corrigir a regra de gestão administrativa no Admin Master para separar claramente:

- **Arquivar**: esconder da área pública e dos organizadores, preservando histórico no banco.
- **Excluir definitivo**: remover o registro do banco de dados, indicado para dados demo/teste ou cadastros criados errado.

## Torneios

- O botão **Arquivar** mantém o torneio no banco com `status = archived`, `visibility = private` e `metadata.adminArchived = true`.
- Torneios arquivados ficam invisíveis para páginas públicas e para painéis de organizador.
- O botão **Excluir definitivo** remove o torneio do banco de dados.
- Antes de excluir definitivamente, o Admin precisa confirmar e digitar `EXCLUIR`.
- A RPC remove inscrições relacionadas em `tournament_participants` antes de apagar o torneio.

## Equipes

- O botão **Arquivar** mantém a equipe no banco, porém como inativa/privada e com `metadata.adminArchived = true`.
- Equipes arquivadas ficam invisíveis para a área pública.
- O botão **Excluir definitivo** remove a equipe do banco de dados.
- Antes de excluir definitivamente, o Admin precisa confirmar e digitar `EXCLUIR`.
- A RPC remove vínculos em `team_members` e `team_invites` antes de apagar a equipe.

## Arquivos alterados

```txt
js/admin/admin-page.js
js/tournaments/tournaments-storage.js
js/teams/teams-storage.js
docs/sql/v1_6_79_6_admin_archive_delete_permanent.sql
docs/releases/v1_6_79_6_admin_archive_delete_permanent.md
```

## Validação manual

1. Rodar o SQL `docs/sql/v1_6_79_6_admin_archive_delete_permanent.sql` no Supabase.
2. No Admin Master, arquivar um torneio e confirmar que ele some da página pública de torneios.
3. No Admin Master, excluir definitivamente um torneio teste e confirmar que ele some do Admin e da página pública.
4. No Admin Master, arquivar uma equipe e confirmar que ela some da página pública de equipes.
5. No Admin Master, excluir definitivamente a equipe demo/teste e confirmar que ela some do Admin e do banco.
6. Conferir o Console do navegador; ignorar apenas `favicon.ico 404`.
