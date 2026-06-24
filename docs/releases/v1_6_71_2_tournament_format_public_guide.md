# v1.6.71.2 — Guia público do formato no torneio

Este patch aprofunda a base de formatos avançados da plataforma -SBW- sem liberar formatos incompletos para uso real.

## O que mudou

- O catálogo central de formatos recebeu informações públicas adicionais:
  - fluxo competitivo;
  - descrição resumida;
  - recursos principais;
  - diferença entre formato base, avançado e planejado.
- A página pública do detalhe do torneio agora exibe um card de **Formato competitivo** na Visão Geral.
- O card mostra:
  - nome do formato;
  - disponibilidade;
  - categoria;
  - modo competitivo;
  - resumo do fluxo;
  - recursos principais.
- O Team Battle League 4v4 continua aparecendo como formato planejado, sem gerar estrutura automática nesta versão.

## Arquivos alterados

- `js/tournaments/tournament-formats.js`
- `js/tournaments/tournament-detail-page.js`
- `css/tournaments/tournament-detail.css`

## Testes sugeridos

- Abrir `/torneios/detalhe-torneio.html?id=<id-ou-slug-do-torneio>&view=visao-geral`.
- Conferir se o card **Formato competitivo** aparece sem quebrar a Visão Geral.
- Testar torneios Double Elimination, Grupos + Playoffs e Liga/Pontos Corridos.
- Confirmar que inscrições, check-in, participantes, chaves e resultados continuam funcionando.

## Observação

Não altera Supabase, Auth, RLS, ranking, inscrição, check-in, resultados, bracket ou criação real do Team Battle League 4v4.
