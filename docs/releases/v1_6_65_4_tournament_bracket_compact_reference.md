# -SBW- v1.6.65.4 — Bracket compacta estilo start.gg/challonge

## Objetivo

Refinar a aba Chaves/Bracket do detalhe público do torneio para ficar mais próxima da referência visual enviada: bracket compacta, limpa, com leitura profissional no estilo start.gg/Challonge, sem cards gigantes ou linhas quebradas.

## Alterações

- Reduz escala inicial da bracket para 78%.
- Reduz largura dos match cards.
- Compacta altura dos cards de partida.
- Reduz espaçamento entre rounds.
- Reduz distância dos conectores.
- Deixa Winners, Lower e Grand Final mais próximos do visual de bracket profissional.
- Remove textos descritivos extras na aba Chaves.
- Mantém busca por jogador/equipe.
- Mantém zoom, centralizar e arrastar.
- Mantém bracket pré-montada mesmo sem inscritos.
- Mantém entrada de nomes após fechamento do check-in.
- Mantém visual dark/ciano da plataforma -SBW-.

## Arquivos alterados

- `js/tournaments/tournament-detail-page.js`
- `css/tournaments/tournament-detail.css`

## Observação

Esta versão não altera Supabase, Auth, RLS, inscrições, check-in real, geração real de estrutura ou resultados. É um refinamento visual/comportamental da exibição da bracket.
