# v1.6.71.3 — Matriz técnica dos formatos competitivos

Este patch aprofunda a base dos formatos avançados sem liberar ainda a criação funcional do Team Battle League 4v4.

## Alterações

- Adiciona `specs` e `capabilities` ao registro central de formatos em `js/tournaments/tournament-formats.js`.
- Define uma matriz pública/técnica por formato, incluindo participação, estrutura, progressão, confronto e ranking.
- Mantém o Team Battle League 4v4 como formato planejado, com detalhes de estrutura sem ativar criação real.
- Exibe a matriz técnica dentro do card **Formato competitivo** na Visão Geral do torneio.
- Preserva a compatibilidade com os formatos atuais.

## Segurança

Não altera Supabase, Auth, RLS, inscrições, check-in, resultados, bracket, ranking global ou painel Admin Master.
