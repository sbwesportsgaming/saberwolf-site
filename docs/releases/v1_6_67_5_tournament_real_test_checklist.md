# v1.6.67.5 — Checklist de teste real do torneio

## Objetivo

Adicionar uma camada visual de conferência no painel do organizador para guiar o teste real da fase v1.6.67 antes de validar torneios com participantes reais.

## O que mudou

- Adicionado painel **Checklist de teste real** na área de estrutura/resultados do organizador.
- O checklist mostra o estado de:
  - origem dos dados;
  - inscrições carregadas;
  - check-in confirmado;
  - partidas prontas;
  - estrutura Double Elimination;
  - resultados lançados.
- O painel não bloqueia ações. Ele serve como guia visual para evitar testes incompletos ou confusão durante a validação real.
- Incluídas orientações rápidas do fluxo sugerido:
  - inscrição;
  - check-in;
  - gerar estrutura;
  - lançar resultados;
  - validar Lower Bracket / Grand Final.
- Atualizado cache do script do painel do organizador.

## Arquivos alterados

- `js/tournaments/tournament-admin-page.js`
- `torneios/create-tournament/criar-torneio.html`
- `docs/releases/v1_6_67_5_tournament_real_test_checklist.md`

## Observações

- Não altera Supabase, Auth, RLS ou SQL.
- Não altera a progressão Double Elimination da v1.6.67.0.
- Não altera a bracket pública aprovada.
- Não substitui o teste real com participantes; apenas organiza a validação.
