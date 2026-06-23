# v1.6.68.7 — Histórico competitivo do organizador

## Resumo

Refina a aba **Histórico** do perfil público do organizador para exibir torneios finalizados com visual mais claro e útil para consulta pública.

## Alterações

- A aba Histórico agora exibe resumo de torneios finalizados e pontuáveis.
- Torneios finalizados aparecem em formato de linha/lista premium.
- Cada item mostra:
  - nome do torneio;
  - jogo;
  - formato;
  - data;
  - status competitivo;
  - campeão quando disponível;
  - top 3 quando houver classificação final salva;
  - link rápido para resultados.
- Estado vazio foi refinado para explicar que o histórico aparece após torneios finalizados.

## Arquivos alterados

- `torneios/organizador.html`
- `js/tournaments/tournament-organizer-page.js`
- `css/organizers/organizer-profile.css`

## Observações

- Não altera Supabase, Auth, RLS ou SQL.
- Não altera cálculo de ranking.
- Não altera progressão de torneio, inscrições, check-in ou resultados.
