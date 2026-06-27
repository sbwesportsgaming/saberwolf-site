# v1.6.79.8 — Hotfix Admin: exclusão real de equipes e sidebar segura

## Objetivo
Corrigir dois problemas encontrados no teste do Admin Master:

- A RPC de equipes dependia de `teams.is_active`, coluna que não existe na base real.
- A sidebar usava consultas `.or()` frágeis em `profiles/site_permissions`, gerando `400 Bad Request` em algumas páginas.

## Ajustes

- Recria `sbw_admin_manage_team` usando apenas colunas reais da tabela `teams`:
  - `id`, `slug`, `name`, `tag`, `parent_team_slug`, `is_public`, `is_verified`, `status`, `metadata`, `updated_at`.
- `Arquivar` agora marca equipe como:
  - `status = archived`;
  - `is_public = false`;
  - `is_verified = false`;
  - `metadata.adminArchived = true`.
- `Excluir definitivo` remove:
  - vínculos em `team_members`;
  - convites em `team_invites`;
  - subequipes diretas;
  - a equipe principal da tabela `teams`.
- Limpa referências legadas em `profiles`, quando existirem.
- Adiciona `sbw_get_sidebar_context`, RPC segura para a sidebar carregar perfil, foto e permissão admin sem consultas `.or()` quebradas.
- Atualiza a sidebar para usar a RPC nova.

## Observação
Depois de aplicar o SQL, equipes que já tinham sido apenas marcadas antes devem ser excluídas novamente pelo botão **Excluir definitivo** no Admin Master para sair fisicamente do banco.
