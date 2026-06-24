# v1.6.74.1 — Rascunho de configuração do MVP básico Team Battle League 4v4

## Objetivo

Preparar a configuração visual/controlada do MVP básico do Team Battle League 4v4 sem liberar criação real do formato.

## O que entrou

- Helpers técnicos para montar configuração padrão do MVP básico.
- Validação defensiva da regra de divisão única.
- Prévia de campos configuráveis e campos travados.
- Modelo de metadados que será usado futuramente apenas como rascunho controlado.
- Cards visuais no fluxo de criação e no painel do organizador.

## Regra mantida

- Team Battle League 4v4 básica = divisão única.
- Team Battle League 4v4 avançada = várias divisões.

## Segurança

- Não libera criação real.
- Não cria SQL.
- Não altera Supabase/Auth/RLS.
- Não ativa inscrições, check-in ou resultados reais.
- Não mistura esse formato com bracket Double Elimination.
