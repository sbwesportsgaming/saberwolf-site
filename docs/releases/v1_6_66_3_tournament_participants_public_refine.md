# v1.6.66.3 — Participantes públicos refinados

## Objetivo

Refinar a view pública de Participantes do torneio, mantendo o padrão visual premium da plataforma -SBW- e respeitando o comportamento definido para antes e depois do fechamento do check-in.

## Alterações

- Reorganizada a aba `view=participantes`.
- Adicionado card de estágio da lista pública:
  - pré check-in;
  - check-in aberto;
  - check-in encerrado.
- Adicionado resumo com:
  - inscritos ativos;
  - check-ins confirmados;
  - pendências;
  - status da inscrição.
- Antes do fechamento do check-in, a view mostra todos os inscritos reais.
- Durante o check-in, os confirmados passam a receber destaque visual.
- Depois do fechamento do check-in, os confirmados aparecem como lista principal.
- Inscritos sem check-in aparecem em seção auxiliar de auditoria visual quando existirem.
- Lista de espera e removidos/cancelados aparecem em seções separadas somente quando existirem no histórico carregado.
- Cards de participantes ficaram mais limpos e organizados.

## Arquivos alterados

- `torneios/detalhe-torneio.html`
- `js/tournaments/tournament-detail-page.js`
- `css/tournaments/tournament-detail.css`

## Não alterado

- Supabase/Auth/RLS.
- Inscrição real.
- Check-in real.
- Bracket aprovada.
- Resultados públicos.
- Painel do organizador.
- Geração de estrutura/chaves.
