# v1.6.74.4/74.5/74.6 — Equipes reais, confrontos e classificação básica Team Battle League 4v4

Este patch consolida em uma única entrega as etapas planejadas para o MVP básico do Team Battle League 4v4.

## Escopo consolidado

- v1.6.74.4 — Equipes reais confirmadas no grupo
- v1.6.74.5 — Confrontos básicos da Divisão Única
- v1.6.74.6 — Resultados e classificação básica

## O que mudou

- O Team Battle League 4v4 agora possui uma camada operacional para montar a Divisão Única somente com equipes reais confirmadas.
- A tabela pública/admin continua vazia enquanto o check-in não estiver encerrado.
- Após check-in encerrado, o helper tenta montar equipes reais a partir de participantes/inscrições/check-ins do torneio.
- Equipes só entram se houver elenco 4v4 suficiente e presença/check-in confirmado.
- A Divisão Única gera confrontos básicos em round-robin entre as equipes reais confirmadas.
- Resultados salvos em metadados/settings do formato podem ser reaproveitados para calcular placar e classificação.
- A classificação básica considera pontos de batalha, vitórias, saldo e vitórias individuais já existentes na base técnica do formato.

## Regra mantida

```txt
Team Battle League 4v4 básica = divisão única
Team Battle League 4v4 avançada = várias divisões
```

## Direção de produto

O fluxo correto passa a ser:

```txt
Criar torneio → configurar formato
Torneio criado → mostrar molde vazio
Check-in encerrado → preencher com equipes reais confirmadas
Resultados registrados → atualizar confrontos e classificação
```

Não foram adicionadas equipes demo, bots, fakes ou placeholders como participantes reais.

## Arquivo alterado

```txt
js/tournaments/team-battle-league.js
```

## Não alterado

- Supabase
- Auth
- RLS
- inscrições reais do banco
- check-in real do banco
- painel Admin Master
- ranking global
- bracket atual

