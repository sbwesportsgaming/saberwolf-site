# v1.6.70.0 — Base do Ranking Global -SBW- e elegibilidade

## Objetivo

Iniciar a fase de Ranking Global -SBW- separando a classificação oficial da plataforma dos rankings por organizador.

## Alterações

- A página de Rankings passa a carregar um snapshot separado para o Ranking Global -SBW- usando somente torneios com status global aprovado.
- Os rankings por organizador continuam usando torneios pontuáveis do organizador, separados do ranking global.
- Adicionado painel de elegibilidade global na página de Rankings.
- O painel mostra contadores de torneios:
  - aprovados para Ranking Global -SBW-;
  - em análise;
  - apenas ranking do organizador;
  - não elegíveis.
- Ajustada a leitura de `globalStatus`, `sbwGlobalApproved` e `sbwGlobalRequested` em `rankings-storage.js`.
- Torneios sem configuração global explícita passam a ficar como `organizer`, não como pendentes automaticamente.

## Observações

- Não cria SQL.
- Não altera RLS.
- Não altera Supabase/Auth.
- Não aprova torneios automaticamente.
- Não altera regras de pontuação.
- Esta etapa é uma base de separação e visualização; o fluxo de solicitação/aprovação global deve entrar nos próximos patches.
