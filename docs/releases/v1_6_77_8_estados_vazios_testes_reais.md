# v1.6.77.8 — Estados vazios guiados para testes reais

## Objetivo

Melhorar a estabilidade operacional percebida durante testes reais com organizador externo e jogadores, sem alterar regras de banco, Team Battle ou fluxo competitivo.

## Principais ajustes

- Página pública de torneio passa a mostrar um estado de "torneio não encontrado" mais claro e acionável.
- Lista pública de participantes ganha orientações úteis quando ainda não há inscritos ou check-ins.
- Painel do organizador ganha estados vazios guiados para:
  - organização sem torneios vinculados;
  - lista de inscritos vazia;
  - filtro de inscritos sem resultado;
  - falha ao carregar torneios;
  - falha ao carregar inscritos;
  - função de inscritos indisponível.
- Estados vazios agora explicam o próximo passo sem parecer erro técnico.
- Painel adiciona botões de ação em estados vazios, como:
  - criar torneio;
  - abrir página pública;
  - copiar chamada;
  - atualizar lista;
  - tentar novamente.

## Regras preservadas

- Conta comum continua sem criar organização ou torneio.
- Organizador externo precisa de permissão antes de operar.
- Não altera inscrição/check-in via RPC.
- Não altera Team Battle League 4v4.
- Não adiciona visual refinado profundo; apenas melhora clareza para testes.

## Validação sugerida

- Abrir painel de organizador sem torneios e conferir estado vazio.
- Abrir lista de inscritos de torneio sem inscrições e conferir orientações.
- Usar filtro de inscritos sem resultado e conferir estado vazio.
- Abrir link inválido de torneio e conferir mensagem pública.
- Rodar `git diff --check` antes do commit.
