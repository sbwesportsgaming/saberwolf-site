# v1.6.79.1 — Ajustes Admin Master, equipes e sidebar

## Objetivo

Corrigir pontos operacionais encontrados no Admin Master e melhorar a sidebar global antes dos testes reais da plataforma -SBW-.

## Ajustes

- Corrige alinhamento dos botões do Admin Master, incluindo links como “Ver perfil”.
- Faz os botões “Mostrar menos” recolherem a lista de perfis/equipes/torneios para o estado inicial.
- Ajusta filtros de torneios “Em andamento” e “Finalizados” para reconhecer variações de status como `active`, `ongoing`, `in_progress`, `completed`, `finalized` e equivalentes.
- Na aba Equipes, equipes já verificadas deixam de mostrar o botão “Verificar equipe” e mostram apenas a ação de remover verificação.
- Adiciona ação Admin Master “Excluir do painel” para equipes, com exclusão segura/soft delete.
- Move a conta da sidebar para o topo, ao lado do ícone -SBW-, removendo o card de conta da parte inferior.
- A sidebar passa a exibir a foto de perfil da conta logada quando houver `avatar_url`/`avatarUrl`/foto equivalente.
- O botão “Administrador” na sidebar ganha fallback de permissão para aparecer em páginas que não carregaram o contexto central completo, desde que a conta tenha permissão administrativa real.

## SQL necessário

Aplicar no Supabase:

```txt
docs/sql/v1_6_79_1_admin_teams_sidebar_controls.sql
```

## Observação sobre exclusão de equipes

A ação “Excluir do painel” não apaga fisicamente a equipe. Ela marca a equipe como privada/inativa/removida e registra auditoria no metadata.

Isso preserva histórico, membros e rastreabilidade durante os testes reais.
