# v1.6.60 — Staff real do Organizador

## Objetivo
Adicionar a primeira versão funcional da área de Staff do Organizador de Torneios, dentro do painel interno.

## Arquivos alterados
- `torneios/editar-organizador.html`
- `js/tournaments/tournament-organizer-admin-page.js`
- `js/tournaments/tournaments-storage.js`
- `css/tournaments/tournament-organizer-admin.css`
- `docs/sql/v1_6_60_organizer_staff.sql`

## O que entrou
- Área real de Staff no painel interno do organizador.
- Campo para adicionar usuário pelo slug, username, ID do perfil ou auth user ID.
- Seleção de cargo: Staff, Gestor ou Administrador.
- Listagem real dos membros do staff da organização.
- Alteração de cargo pelo painel.
- Remoção de membro do staff pelo painel.
- Proteção para não remover/alterar o dono da organização.
- RPCs específicas para listar, adicionar, alterar cargo e remover staff.

## SQL obrigatório
Rodar no Supabase:

`docs/sql/v1_6_60_organizer_staff.sql`

## Observações
- Esta versão não cria tela de aceite de convite para o convidado; o owner/admin adiciona o usuário diretamente ao staff.
- Convites pendentes/aceite pelo usuário podem entrar em uma fase futura.
- A área respeita a permissão real do organizador via `sbw_can_manage_tournament_organizer`.
