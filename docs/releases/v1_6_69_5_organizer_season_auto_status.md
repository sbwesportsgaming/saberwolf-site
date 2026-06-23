# v1.6.69.5 — Status automático da temporada

## Resumo

Micropatch da fase v1.6.69 para melhorar a leitura de temporadas no painel interno e no perfil público do organizador.

## Alterações

- Adicionado status automático da temporada com base no período configurado.
- Estados previstos:
  - Planejada;
  - Programada;
  - Ativa;
  - Encerrada;
  - Datas inválidas, quando aplicável no painel interno.
- Adicionada indicação de próxima ação no painel interno do organizador.
- Adicionada descrição contextual do status na aba pública de Temporadas.
- Atualizado cache dos arquivos do painel e perfil público do organizador.

## Arquivos alterados

- `torneios/editar-organizador.html`
- `torneios/organizador.html`
- `js/tournaments/tournament-organizer-admin-page.js`
- `js/tournaments/tournament-organizer-page.js`
- `css/tournaments/tournament-organizer-admin.css`
- `css/organizers/organizer-profile.css`

## Observações

Não altera Supabase, Auth, RLS, SQL, ranking, inscrições, check-in, resultados ou progressão de chaves.
