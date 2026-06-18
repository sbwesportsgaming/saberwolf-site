# v1.6.52 — Permissão real para criar Organização de Torneios

## Objetivo

Abrir a nova fase de Organizações de Torneios com uma porta de entrada segura no Supabase: a -SBW- concede permissão real para um usuário criar uma organização, sem dar poder global e sem liberar criação de torneio ainda.

## Arquivos alterados

- `admin/admin.html`
- `js/admin/admin-page.js`
- `js/auth/auth-service.js`
- `js/auth/auth-header.js`
- `js/core/sbw-session-context.js`
- `torneios/torneios.html`
- `js/tournaments/tournaments-list-page.js`
- `torneios/editar-organizador.html`
- `js/tournaments/tournament-organizer-admin-page.js`
- `css/torneios.css`
- `docs/sql/v1_6_52_organizer_permission_gate.sql`

## O que mudou

- `organizer_permissions` passa a ter permissão separada para criar Organização de Torneios.
- Admin Master/Admin SBW pode conceder/remover a permissão via RPC segura.
- A permissão `can_create_organizations` não libera criação de torneio.
- `SBWSessionContext` agora entende `canCreateTournamentOrganizer` separado de `canCreateTournament`.
- O menu de conta pode mostrar “Criar organização” para usuário autorizado.
- A página de Torneios mostra uma porta de entrada para Organização de Torneios.
- `editar-organizador.html?novo=1` confirma a permissão real e informa que a criação real entra na v1.6.53.

## O que não mudou

- Não cria organização real ainda.
- Não cria torneio.
- Não altera rankings.
- Não altera convites/equipes/transferências.
- Não usa localStorage como autorização real.

## Testes recomendados

1. Rodar `docs/sql/v1_6_52_organizer_permission_gate.sql` no Supabase.
2. Abrir Admin Master.
3. Buscar um usuário comum.
4. Clicar em “Permitir criar organização”.
5. Entrar com esse usuário.
6. Abrir Torneios e confirmar a entrada “Criar organização”.
7. Abrir `torneios/editar-organizador.html?novo=1` e confirmar a mensagem de permissão.
8. Remover a permissão no Admin Master.
9. Confirmar que o usuário perde a entrada de criação.

## Próxima versão

`v1.6.53` deve criar/editar a organização real em `tournament_organizers` e transformar o criador em `owner` da organização.
