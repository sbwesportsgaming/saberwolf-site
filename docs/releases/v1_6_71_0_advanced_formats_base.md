# v1.6.71.0 — Base de formatos avançados

Este patch inicia a fase de **formatos avançados** da plataforma -SBW- sem liberar estruturas competitivas incompletas.

## O que entrou

- Criação do registro central de formatos em `js/tournaments/tournament-formats.js`.
- Padronização de metadados de formato:
  - chave do formato;
  - label público;
  - família competitiva;
  - categoria;
  - status;
  - modo de equipe.
- Preparação do formato futuro **Team Battle League 4v4** como item de roadmap, ainda bloqueado para criação real.
- Área visual na criação de torneio explicando os formatos avançados planejados.
- Salvamento de metadados de formato nos torneios criados.
- Edição do organizador passa a preservar metadados de formato quando o torneio é atualizado.

## Regra importante

O patch **não implementa ainda** Team Battle League 4v4, divisões, escalações, rodadas por equipe ou confrontos avançados.

O objetivo é preparar a base para que os próximos patches possam evoluir sem misturar nomes, labels e estruturas de dados.

## Não alterado

- Supabase/RLS/SQL.
- Auth/login.
- Inscrições/check-in.
- Resultados reais.
- Bracket premium.
- Ranking Global -SBW-.
- Painel Admin Master.
