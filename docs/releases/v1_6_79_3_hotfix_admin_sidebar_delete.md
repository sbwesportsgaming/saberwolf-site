# v1.6.79.3 — Hotfix Admin Master: sidebar e exclusões

Correções focadas após teste local do Admin Master.

## Ajustes

- Corrige largura do bloco de conta no topo da sidebar.
- Mantém a foto/nome da conta visíveis e o botão Administrador com largura correta.
- Faz “Mostrar menos” recolher novamente as listas para o estado inicial.
- Remove equipes excluídas da lista padrão do Admin Master após ação administrativa.
- Remove torneios excluídos da lista padrão do Admin Master após ação administrativa.
- Reaplica RPCs administrativas com soft delete conservador:
  - torneio excluído vira arquivado/privado com `metadata.adminDeleted = true`;
  - equipe excluída vira inativa/privada/não verificada com `metadata.adminDeleted = true`.

## Validação

- Rodar `docs/sql/v1_6_79_3_admin_delete_sidebar_hotfix.sql` no Supabase.
- Testar sidebar na Home e no Admin Master.
- Testar Mostrar todos/Mostrar menos em Usuários, Equipes e Torneios.
- Testar Excluir do painel em Equipes e Torneios.
