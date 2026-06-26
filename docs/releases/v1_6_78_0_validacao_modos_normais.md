# v1.6.78.0 — Validação dos modos normais para teste real

## Objetivo

Adicionar um roteiro interno para validar os modos normais de torneio antes dos testes reais com organização externa, jogadores reais e a Rinha Online.

## Escopo

- Double Elimination;
- Grupos + Playoffs;
- Pontos Corridos;
- validação mínima do Team Battle League 4v4 sem reabrir sua estrutura.

## O que foi adicionado

- Documento de teste real para inscrição/check-in dos modos normais.
- Checklist de pré-requisitos para Admin Master e organizador externo.
- Matriz de testes por formato.
- Critérios de aprovação.
- Modelo para registrar problemas encontrados durante os testes.

## Arquivos adicionados

```txt
docs/tests/v1_6_78_validacao_modos_normais.md
docs/releases/v1_6_78_0_validacao_modos_normais.md
```

## Observações

Este patch não altera código, banco, RPC, visual ou comportamento do Team Battle League 4v4.

A prioridade da v1.6.78 é testar os modos comuns com dados reais antes de adicionar novas funcionalidades.
