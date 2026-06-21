# v1.6.60.1 — Hotfix do formulário de Staff

## Objetivo
Corrigir o formulário de Staff do painel interno do Organizador.

## Problema
No layout lateral do painel, o formulário estava dividido em três colunas:
- perfil do usuário;
- cargo;
- botão adicionar.

Como o card de Staff é estreito, o campo "Perfil do usuário" ficava espremido, dificultando clique e digitação.

## Ajuste
- formulário passa a empilhar os campos;
- campo de perfil ocupa linha inteira;
- select de cargo ocupa linha inteira;
- botão "Adicionar staff" ocupa linha inteira;
- não altera Supabase, RPCs, RLS ou lógica de Staff.

## Arquivos alterados
- `css/tournaments/tournament-organizer-admin.css`
