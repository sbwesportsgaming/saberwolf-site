# -SBW- v1.6.65 — Chaves premium do Torneio

## Objetivo

Refinar a área pública de chaves/estrutura do torneio na plataforma -SBW-, seguindo o visual premium aprovado para brackets competitivas.

## Alterações

- Recria a visualização pública de Double Elimination com painel premium.
- Adiciona Winners Bracket, Lower Bracket e Grand Final em layout próprio.
- Recria a visualização de Groups + Playoffs como bracket vertical/bottom-up.
- Mantém a fase de grupos em área secundária recolhível no formato copa.
- Adiciona busca visual por jogador/equipe na bracket.
- Adiciona destaque discreto para usuário logado quando encontrado na chave.
- Adiciona controles de zoom, centralizar e arrastar bracket.
- Adiciona chips de foco visual: visão completa, Top 16, Top 8, Winners, Lower, Grand Final e Finais.
- Adiciona coluna lateral com sobre o torneio, legenda, próxima partida e últimos resultados.
- Mantém estados vazios premium quando a chave ainda não foi gerada.

## Arquivos alterados

- `js/tournaments/tournament-detail-page.js`
- `css/tournaments/tournament-detail.css`

## Observações

Esta versão é visual/estrutural da interface pública de chaves. Não altera Supabase, RLS, autenticação, inscrições, resultados ou geração de estrutura.
