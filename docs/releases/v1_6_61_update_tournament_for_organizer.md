# v1.6.61 — Gestão real dos torneios pelo Organizador

## Objetivo
Permitir que o Organizador edite dados básicos dos torneios vinculados à própria organização diretamente pelo painel interno.

## Inclui
- botão **Editar** na aba Torneios do painel interno;
- formulário interno para alterar nome, jogo, formato, status, data, horário, limite de participantes, capa, descrição e regras;
- RPC `sbw_update_tournament_for_organizer` para salvar alterações no Supabase;
- proteção para impedir edição de torneios de outra organização;
- manutenção dos botões **Ver** e **Gerenciar** separados.

## Arquivos alterados
- `torneios/editar-organizador.html`
- `js/tournaments/tournament-organizer-admin-page.js`
- `js/tournaments/tournaments-storage.js`
- `css/tournaments/tournament-organizer-admin.css`
- `docs/sql/v1_6_61_update_tournament_for_organizer.sql`

## SQL obrigatório
Rodar `docs/sql/v1_6_61_update_tournament_for_organizer.sql` no Supabase antes de testar a edição real.

## Fora do escopo
- chaves;
- resultados;
- inscrições profundas;
- ranking real;
- edição avançada de estrutura competitiva.
