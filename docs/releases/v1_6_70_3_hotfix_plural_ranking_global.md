# v1.6.70.3 — Hotfix plural do Ranking Global

## Objetivo

Corrigir a grafia exibida na página de Rankings quando o contador de torneios pontuáveis era pluralizado.

## Ajuste

- Corrigido texto que podia aparecer como `Pontuaveleis`/`pontuáveleis`.
- Agora o texto usa a palavra inteira conforme a quantidade:
  - `1 pontuável`;
  - `2 pontuáveis`.

## Arquivos alterados

- `js/rankings/rankings-page.js`

## Observação

Não altera regra de ranking, cálculo, Supabase, Auth, RLS, torneios, inscrições, check-in, resultados ou bracket.
