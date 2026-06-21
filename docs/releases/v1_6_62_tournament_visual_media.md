# v1.6.62 — Visual premium do torneio e upload de capa

## Objetivo
Atualizar a página pública do torneio para o padrão visual premium atual da -SBW- e trocar o campo simples de URL da capa por um fluxo de upload/enquadramento no painel do organizador.

## Arquivos alterados
- `torneios/detalhe-torneio.html`
- `torneios/editar-organizador.html`
- `js/tournaments/tournament-detail-page.js`
- `js/tournaments/tournament-organizer-admin-page.js`
- `css/tournaments/tournament-detail.css`
- `css/tournaments/tournament-organizer-admin.css`
- `docs/sql/v1_6_62_tournament_media_layout.sql`

## Mudanças
- Página pública do torneio recebe hero premium com capa/banner.
- Capa do torneio respeita enquadramento salvo em `metadata.tournamentAssets.cover`.
- Header e seções da página pública ficam menos antigos/carregados.
- Edição de torneio no painel do organizador usa upload de imagem.
- URL manual fica disponível apenas como fallback avançado.
- Editor de capa permite zoom, posição horizontal e posição vertical.
- RPC `sbw_update_tournament_for_organizer` passa a salvar metadados de enquadramento.
- Storage passa a aceitar arquivos no caminho `tournaments/...` dentro do bucket `sbw-team-assets`.

## Fora do escopo
- Chaves/resultados/inscrições profundas.
- Regras de ranking real.
- Mudanças no Staff do organizador.
