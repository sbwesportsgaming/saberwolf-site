# v1.6.70.2 — Fluxo de torneio pontuável para Ranking Global -SBW-

## Objetivo

Alinhar criação e gestão de torneios à regra oficial da plataforma -SBW-:

- todo torneio criado na plataforma pode escolher se pontua ou não;
- torneio pontuável conta para o ranking do organizador;
- torneio pontuável também é elegível para o Ranking Global -SBW-;
- torneio não pontuável aparece normalmente, mas não gera pontos.

## Alterações

- Adicionado campo **Pontuação/ranking** na criação de torneio.
- O torneio criado passa a salvar flags explícitas de pontuação em `settings` e `metadata.ranking`.
- O painel do organizador passa a tratar torneio pontuável como escopo `organizer_and_global`.
- Textos da área de temporadas foram ajustados para explicar que torneios pontuáveis contam para o ranking do organizador e para o Ranking Global -SBW-.
- A detecção de torneios pontuáveis passou a reconhecer também campos globais e campos genéricos de ranking.

## Não alterado

- Não foi criado fluxo de solicitação/aprovação global.
- Não foi alterado Supabase, Auth ou RLS.
- Não foi alterado bracket, check-in, inscrições ou resultados.
- Não foi criado painel Admin Master de auditoria global neste patch.
