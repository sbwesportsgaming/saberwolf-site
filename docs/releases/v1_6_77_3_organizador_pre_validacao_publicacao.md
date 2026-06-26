# v1.6.77.3 — Pré-validação de publicação do organizador externo

## Objetivo

Preparar o painel do organizador para testes reais com a Rinha Online e outros organizadores externos, evitando que um torneio seja publicado ou aberto para inscrições sem dados mínimos de operação.

## Escopo

- Adiciona pré-validação estrutural no formulário de edição de torneios do painel do organizador.
- Permite salvar rascunho com pendências.
- Bloqueia publicação, agendamento, abertura de inscrições ou início do torneio quando faltarem dados obrigatórios.
- Exibe card decente para teste com itens OK/pendentes.
- Adiciona badge de prontidão operacional na lista de torneios vinculados.

## Itens validados antes de publicar/abrir inscrições

- Nome público do torneio.
- Jogo.
- Formato liberado para uso.
- Data/horário de referência.
- Limite par de participantes/equipes.
- Abertura e fechamento das inscrições.
- Abertura e fechamento do check-in.
- Ordem coerente das janelas.

## Regra importante

O organizador ainda pode salvar torneios em rascunho incompletos. A trava atua apenas quando o status indica exposição/uso real, como publicado, inscrições abertas, agendado ou em andamento.

## Arquivos alterados

- `js/tournaments/tournament-organizer-admin-page.js`
- `css/tournaments/tournament-organizer-admin.css`
- `torneios/editar-organizador.html`
- `docs/releases/v1_6_77_3_organizador_pre_validacao_publicacao.md`

## Validação manual sugerida

1. Abrir painel do organizador.
2. Editar um torneio em rascunho sem janelas e salvar: deve permitir.
3. Alterar o status para publicado/inscrições abertas sem janelas: deve bloquear e listar pendências.
4. Preencher janelas válidas e salvar: deve permitir.
5. Tentar colocar fechamento antes da abertura: deve bloquear.
6. Confirmar que a lista de torneios mostra badge de prontidão/pendências.

## Observação

Este patch não mexe na estrutura do Team Battle League 4v4. A validação é geral para o painel do organizador e serve como segurança operacional antes dos testes reais.
