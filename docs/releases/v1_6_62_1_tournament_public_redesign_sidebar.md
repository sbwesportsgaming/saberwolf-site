# v1.6.62.1 — Repaginação pública do Torneio com sidebar

## Objetivo
Atualizar a página pública de detalhes do torneio para o padrão visual premium atual da -SBW-, removendo o header/top nav legado e o texto antigo “SaberWolf” do topo.

## Arquivos alterados
- `torneios/detalhe-torneio.html`
- `css/tournaments/tournament-detail.css`
- `js/tournaments/tournament-detail-page.js`

## Ajustes
- Remove navegação superior antiga.
- Usa sidebar padrão da -SBW-.
- Corrige favicon para `logo-sbw.png`.
- Cria visual premium com hero/banner, cards, abas e seções no padrão atual.
- Aplica capa/banner do torneio como fundo do hero quando existir.
- Lê enquadramento salvo em `metadata.tournamentAssets.cover` e variações compatíveis.
- Mantém funções públicas existentes: inscrição, participantes, estrutura, regras e cronograma.
- Não altera Supabase/RPC/RLS.
