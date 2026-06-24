# v1.6.72.12 — Snapshot operacional Team Battle League 4v4

## Objetivo

Adicionar uma camada técnica de snapshot operacional para o formato **Team Battle League 4v4** da plataforma -SBW-.

## Alterações

- Adicionado helper para gerar um snapshot único do estado da liga.
- Adicionado checklist administrativo técnico para uso futuro no painel do organizador.
- Adicionado rótulo padronizado de status operacional.
- O snapshot consolida:
  - prontidão estrutural;
  - ciclo operacional;
  - linha do tempo;
  - inscrições;
  - check-ins;
  - resumo público;
  - próxima ação sugerida;
  - erros e avisos técnicos.

## Regra mantida

- Team Battle League 4v4 básica = uma divisão única.
- Team Battle League 4v4 avançada = várias divisões.

## Observação

O formato continua em preparação e não foi liberado para criação real.

Este patch não altera Supabase, Auth, RLS, inscrições reais, check-in real, bracket, Ranking Global ou Admin Master.
