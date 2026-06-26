# v1.6.77.4 — Gestão operacional de inscritos e check-in pelo organizador

## Objetivo

Preparar o painel do organizador externo para testes reais com jogadores, dando uma visão mais clara dos inscritos e do check-in sem mexer na estrutura do Team Battle League 4v4.

## O que mudou

- Adicionado contador de inscritos pendentes de check-in.
- Adicionados filtros operacionais na lista de inscritos:
  - ativos;
  - pendentes de check-in;
  - check-in feito;
  - lista de espera;
  - removidos;
  - todos.
- Adicionado botão de atualização manual da lista de inscritos.
- Adicionado botão para copiar uma lista de chamada do filtro atual.
- O painel agora mostra quantos inscritos estão visíveis no filtro e quantos ainda estão pendentes de check-in.
- Cards com check-in feito recebem destaque visual discreto.

## Regras preservadas

- Conta comum continua sem criar organização ou torneio.
- Organizador externo precisa de permissão.
- Inscrição pública e check-in público continuam protegidos por RPC.
- O Team Battle League 4v4 continua sem inscrição individual comum.
- Este patch não cria equipe fake/demo e não altera a lógica do Team Battle.

## Validação manual recomendada

1. Abrir o painel do organizador.
2. Abrir um torneio com inscritos reais ou aguardar o teste real.
3. Abrir o painel de inscritos.
4. Trocar filtros.
5. Usar Atualizar.
6. Usar Copiar chamada.
7. Fazer check-in manual de um inscrito e confirmar se os contadores mudam.
