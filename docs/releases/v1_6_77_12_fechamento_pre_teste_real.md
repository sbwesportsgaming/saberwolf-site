# v1.6.77.12 — Fechamento da preparação para teste real

## Objetivo

Consolidar a fase v1.6.77 como preparação operacional para testes reais com a organização Rinha Online, jogadores reais e torneios reais da plataforma -SBW-.

## Contexto

A fase v1.6.77 foi focada em reduzir riscos antes dos testes externos, sem adicionar novos modos competitivos e sem reabrir a estrutura do Team Battle League 4v4.

A prioridade foi garantir que um organizador externo autorizado consiga operar a plataforma com o mínimo de intervenção manual da -SBW-.

## Consolidação da fase

Esta release adiciona um checklist final em:

```txt
docs/tests/v1_6_77_checklist_final_pre_teste_real.md
```

O checklist cobre:

- pré-requisitos do Admin Master;
- validação da permissão da Rinha Online;
- criação/edição do perfil organizacional;
- criação de torneio vinculado à organização;
- inscrição pública;
- check-in público;
- gestão de inscritos/check-ins pelo organizador;
- divulgação pública;
- validação mínima do Team Battle League 4v4;
- erros de Console;
- critérios de aprovação e reprovação.

## Regras confirmadas

- Conta comum não cria organização.
- Conta comum não cria torneio.
- Organizador externo precisa de permissão da -SBW-.
- Depois de autorizado, o organizador cria o próprio perfil organizacional.
- Torneios precisam ficar vinculados à organização correta.
- Inscrição e check-in públicos devem passar por RPC.
- Team Battle League 4v4 não aceita inscrição individual comum.
- Team Battle League 4v4 usa inscrição por equipe em etapa própria futura.
- Jogadores do Team Battle 4v4 devem pertencer à mesma equipe real da plataforma.

## Observação

Este patch é documental e não altera comportamento do sistema.

Ele serve como fechamento da preparação da v1.6.77 e como roteiro de validação antes dos testes reais.
