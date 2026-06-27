# v1.6.80.1 — Admin Master: controle de Organizações de Torneios

## Objetivo
Adicionar controle administrativo completo sobre Organizações de Torneios e simplificar a lateral pública da página de torneios.

## Entregas
- Nova área "Organizações criadas" na aba Organizadores do Admin Master.
- Ações administrativas por organização:
  - Arquivar: preserva histórico, oculta organização e torneios vinculados.
  - Excluir definitivo: remove organização, membros/staff, torneios vinculados e participantes desses torneios.
- Nova RPC `sbw_admin_list_tournament_organizers`.
- Nova RPC `sbw_admin_manage_tournament_organizer`.
- Página pública de torneios deixa de listar todas as organizações na lateral e passa a mostrar apenas CTA para "Organizadores de Torneios".
- Card "Criar organização" aparece somente para contas com permissão de organizador.
- Contas que já têm organização passam a ver "Minha organização".
- Organizadores arquivados/deletados deixam de aparecer nas consultas públicas normais.

## Observações
A exclusão definitiva é destrutiva. Usar somente para registros demo/teste ou cadastros criados errado.
