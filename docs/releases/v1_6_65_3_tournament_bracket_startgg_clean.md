# -SBW- v1.6.65.3 — Bracket limpa estilo start.gg/challonge

Refina a aba Chaves do detalhe público do torneio para um visual mais limpo, profissional e menos quebrado, inspirado em brackets de plataformas competitivas como start.gg/Challonge, mantendo a identidade dark premium da plataforma -SBW-.

## Arquivos alterados

- `js/tournaments/tournament-detail-page.js`
- `css/tournaments/tournament-detail.css`

## Ajustes

- Remove o aspecto de painel/caixa pesada da área da bracket.
- Compacta a barra de busca e controles.
- Reorganiza a Double Elimination em colunas horizontais mais limpas.
- Mantém Winners Bracket, Lower Bracket, Grand Final e Reset.
- Mantém bracket pré-montada mesmo sem inscritos reais.
- Mantém nomes entrando após fechamento do check-in, usando confirmados.
- Mantém busca por jogador/equipe.
- Mantém zoom, arrastar e centralizar bracket.
- Compacta cards de partida para estilo profissional.
- Oculta rodapé pesado dos match cards na aba Chaves.
- Deixa conectores mais discretos e consistentes.
- Mantém estados vazios e dados reais como prioridade.

## Observação

Não altera Supabase, Auth, RLS, inscrições, check-in, geração real de estrutura ou resultados.
