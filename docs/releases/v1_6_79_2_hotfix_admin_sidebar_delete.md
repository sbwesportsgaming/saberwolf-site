# v1.6.79.2 — Hotfix Admin Master, sidebar e exclusões seguras

## Objetivo

Corrigir pontos encontrados no teste local do Admin Master após a v1.6.79.1.

## Ajustes

- Remove a marca `-SBW-` duplicada do topo da sidebar quando a conta já aparece no topo.
- Mantém a conta logada no topo da sidebar.
- Melhora o carregamento da foto do perfil na sidebar, buscando mais variações de `avatar_url`, `photo_url`, `profile_image_url`, `metadata.avatarUrl`, `metadata.profileAssets`, etc.
- Exibe um atalho visível de **Administrador** na sidebar para contas com permissão administrativa.
- Mantém o item **Administrador** também dentro do menu da conta.
- Reforça o alinhamento dos botões do Admin Master.
- Melhora o reconhecimento de equipes verificadas quando o banco retorna `is_verified` como string ou via metadata.
- Reforça filtros de torneios em andamento/finalizados com mais variações de status.
- Adiciona fallback direto no front para ações administrativas se a RPC falhar, mantendo aviso para rodar o SQL.
- Atualiza as RPCs de exclusão segura de equipes e torneios com checagem administrativa mais tolerante.

## SQL obrigatório

Executar no Supabase SQL Editor:

```txt
docs/sql/v1_6_79_2_admin_delete_actions_hotfix.sql
```

## Observação

As exclusões continuam sendo soft delete:

- Torneios: `status = deleted`, `visibility = private`, `metadata.adminDeleted = true`.
- Equipes: `status = deleted`, `is_active = false`, `is_public = false`, `metadata.adminDeleted = true`.

Nada é apagado fisicamente do banco nesta fase.
