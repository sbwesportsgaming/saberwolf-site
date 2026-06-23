# v1.6.69.3 — Auditoria visual da temporada do organizador

## Objetivo

Adicionar uma leitura rápida de auditoria na área de Temporadas do painel interno do organizador, sem criar tabelas novas e sem alterar RLS.

## Alterações

- Adicionado bloco **Auditoria da temporada** no painel interno do organizador.
- Exibe vínculos e torneios pontuáveis recentes da temporada atual.
- Mostra tipo, título, detalhe e data aproximada do registro.
- Mantém estado vazio limpo quando ainda não há alterações recentes.
- Atualizado cache do script do painel do organizador.

## Arquivos alterados

- `torneios/editar-organizador.html`
- `js/tournaments/tournament-organizer-admin-page.js`
- `css/tournaments/tournament-organizer-admin.css`

## Observações

- Não altera Supabase, Auth, RLS ou SQL.
- Não altera ranking, inscrições, check-in, resultados ou progressão de chaves.
