# v1.6.66.5 — Visão geral final da página pública do torneio

## Objetivo

Refinar a view `view=visao-geral` para funcionar como a página inicial pública do torneio, concentrando informações essenciais sem mexer em Supabase, Auth, RLS, inscrições, check-in, bracket aprovada, resultados públicos ou painel do organizador.

## O que foi alterado

- Reorganizada a Visão geral como um resumo competitivo mais completo.
- Adicionado card principal com status atual e etapa em andamento.
- Adicionados cards de métricas para inscrição, participantes, chaves e resultados.
- Adicionado bloco de ações rápidas:
  - Inscrição / check-in;
  - Participantes;
  - Chaves;
  - Resultados;
  - Ver organizador / Gerenciar organização.
- Adicionado card “Sobre o torneio” com informações principais.
- Adicionado preview da próxima partida ou partida em andamento.
- Adicionado bloco de últimos resultados.
- Adicionada mini linha do tempo com datas principais.
- Adicionado resumo lateral com próxima etapa, datas, legenda e acesso rápido.

## Arquivos alterados

```txt
css/tournaments/tournament-detail.css
js/tournaments/tournament-detail-page.js
torneios/detalhe-torneio.html
```

## Páginas para testar

```txt
/torneios/detalhe-torneio.html?id=teste-2
/torneios/detalhe-torneio.html?id=teste-2&view=visao-geral
/torneios/detalhe-torneio.html?id=teste-2&view=cronograma
/torneios/detalhe-torneio.html?id=teste-2&view=participantes
/torneios/detalhe-torneio.html?id=teste-2&view=inscricao
/torneios/detalhe-torneio.html?id=teste-2&view=chaves
/torneios/detalhe-torneio.html?id=teste-2&view=resultados
/torneios/detalhe-torneio.html?id=teste-2&view=regras
```

## Observações

- A bracket premium aprovada não foi refeita.
- Resultados públicos já aprovados não foram alterados estruturalmente.
- O painel do organizador não foi alterado.
- Não houve alteração em tabelas, SQL, Supabase, Auth ou RLS.
