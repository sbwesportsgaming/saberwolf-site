# v1.6.77.5 — Orientações públicas para jogadores nos testes reais

## Objetivo

Preparar a página pública do torneio para testes reais com jogadores, reduzindo dúvidas sobre inscrição, login, check-in e leitura de regras sem mexer na estrutura do Team Battle League 4v4.

## O que mudou

- Adicionado bloco público **Orientação para jogadores** na área de inscrição.
- O bloco muda conforme o estado do jogador/torneio:
  - login necessário;
  - inscrições abertas;
  - inscrição já localizada;
  - check-in aberto;
  - inscrição por equipe no Team Battle League 4v4.
- Reforço público de que o check-in deve ser acompanhado depois da inscrição.
- Reforço para ler regras, formato, horários e canais de comunicação antes das partidas.

## Regras preservadas

- Não altera RPC de inscrição/check-in.
- Não altera permissões.
- Não altera Team Battle League 4v4.
- Não cria equipe ou participante demo.
- Não adiciona refinamento visual pesado.

## Validação manual

- Abrir página pública de torneio comum sem login.
- Abrir página pública de torneio comum com login.
- Conferir área de inscrição quando inscrições estão abertas/fechadas.
- Conferir orientação quando o jogador já está inscrito.
- Conferir orientação quando o check-in estiver aberto.
- Conferir torneio Team Battle League 4v4 e validar que aparece aviso de inscrição por equipe.
