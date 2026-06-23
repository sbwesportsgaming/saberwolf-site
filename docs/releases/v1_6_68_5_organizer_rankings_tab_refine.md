# v1.6.68.5 — Aba Rankings do organizador refinada

## Objetivo
Refinar a aba dedicada de Rankings do perfil público do organizador, mantendo o ranking fora da Visão Geral e deixando a leitura mais limpa quando ainda não houver torneios finalizados/pontuáveis.

## Alterações
- Criado cabeçalho próprio para a aba Rankings do organizador.
- Adicionado estado vazio mais claro para rankings ainda sem dados reais.
- Adicionado bloco resumido de regras aplicadas ao ranking do organizador.
- Mantido botão para abrir o ranking completo filtrado na página geral de Rankings.
- Adicionado suporte a deep link simples por `#rankings` ou `?tab=rankings` no perfil do organizador.
- Ajustado CSS para evitar cards apertados/scroll desnecessário na aba Rankings.

## Arquivos alterados
- `torneios/organizador.html`
- `js/tournaments/tournament-organizer-page.js`
- `css/organizers/organizer-profile.css`
- `docs/releases/v1_6_68_5_organizer_rankings_tab_refine.md`

## Observações
- Não altera cálculo de ranking.
- Não altera Supabase, Auth, RLS ou SQL.
- Não altera torneios, inscrições, check-in, progressão de resultados ou bracket pública.
