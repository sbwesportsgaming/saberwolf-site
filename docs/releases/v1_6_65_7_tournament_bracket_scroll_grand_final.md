# v1.6.65.7 — Ajustes finais da bracket Double Elimination

Patch incremental da visualização pública de Chaves/Bracket da página de torneio.

## Ajustes

- Corrige a rolagem horizontal interna da área da bracket.
- Mantém rolagem vertical dentro da área da chave.
- Mantém zoom, busca e conectores SVG.
- Reorganiza a Double Elimination para deixar a Grand Final logo após a Winners Final, sem esticar a chave até o fim do Lower Bracket.
- Mantém a linha do Lower Final como conector de retorno para a Grand Final.
- Reduz o banner/hero especificamente na view `view=chaves`, evitando que ele ocupe altura excessiva antes da bracket.

## Arquivos alterados

- `torneios/detalhe-torneio.html`
- `js/tournaments/tournament-detail-page.js`
- `css/tournaments/tournament-detail.css`

## Observação

Não altera Supabase, Auth, RLS, inscrições, check-in, geração real de estrutura, resultados ou painel do organizador.
