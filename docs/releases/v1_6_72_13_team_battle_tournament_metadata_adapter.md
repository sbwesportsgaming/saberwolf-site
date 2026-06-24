# v1.6.72.13 — Adaptador de metadados do torneio para Team Battle League 4v4

Esta versão adiciona uma camada técnica para conectar futuramente o formato **Team Battle League 4v4** aos metadados de um torneio da plataforma -SBW-, sem liberar o formato para criação real ainda.

## O que foi adicionado

- leitura segura de dados Team Battle League dentro de `metadata` e `settings` do torneio;
- normalização do payload técnico do formato a partir de um torneio;
- montagem de metadados prontos para salvar no rascunho do torneio;
- helper para anexar a estrutura Team Battle League a um torneio em rascunho;
- prévia administrativa com modo básico/avançado, checklist, linha do tempo e próxima ação.

## Regra mantida

- Team Battle League 4v4 básica = uma divisão única;
- Team Battle League 4v4 avançada = várias divisões;
- o formato continua com status **em preparação**;
- a criação real do formato ainda permanece bloqueada.

## Arquivo alterado

- `js/tournaments/team-battle-league.js`

## Observação

Este patch não altera Supabase, Auth, RLS, inscrições reais, check-in real, bracket, ranking global ou painel Admin Master. É uma camada de preparação para quando o formato for conectado ao fluxo real de criação/edição de torneio.
