# v1.6.79.0 — Admin Master: gestão global de torneios

## Objetivo

Adicionar ao Admin Master uma área para visualizar todos os torneios criados na plataforma -SBW- e executar ações administrativas seguras sem precisar abrir o painel de cada organizador.

## O que entrou

- Nova aba **Torneios** no Admin Master.
- Listagem global de torneios da plataforma.
- Busca por nome, jogo, organizador, status e slug.
- Filtros rápidos por status operacional.
- Cards com jogo, formato, organizador, inscritos, check-ins, visibilidade e status.
- Atalhos para página pública e gerenciamento.
- Ações administrativas:
  - marcar como rascunho;
  - ocultar;
  - publicar;
  - arquivar;
  - excluir do painel.
- SQL com RPCs protegidas por Admin Master/Admin SBW:
  - `sbw_admin_list_tournaments`;
  - `sbw_admin_manage_tournament`.

## Segurança

A ação “Excluir do painel” é uma exclusão segura/soft delete:

- não apaga fisicamente a linha do banco;
- não remove histórico de participantes/resultados;
- define `status = deleted`;
- define `visibility = private`;
- registra a ação no `metadata.adminLastAction`.

Isso evita perder histórico antes dos testes reais e permite auditoria.

## Arquivos alterados

- `admin/admin.html`
- `js/admin/admin-page.js`
- `css/admin.css`
- `docs/sql/v1_6_79_0_admin_tournaments_global.sql`
- `docs/releases/v1_6_79_0_admin_tournaments_global.md`

## Validação sugerida

1. Rodar o SQL no Supabase.
2. Abrir Admin Master.
3. Verificar a nova aba **Torneios**.
4. Clicar em **Mostrar todos**.
5. Buscar por um torneio real.
6. Testar **Ocultar** em um torneio de teste.
7. Testar **Publicar** para reativar.
8. Testar **Excluir do painel** somente em torneio de teste.
9. Conferir se a ação aparece refletida na página pública/listagem.

## Observação

Este patch não implementa Analytics e não mexe em AdSense. É uma necessidade operacional do Admin Master antes de avançar com novas métricas.
