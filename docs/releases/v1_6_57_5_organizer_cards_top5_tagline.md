# -SBW- v1.6.57.5 — Cards, Top 5 e frase editável do Organizador

## Objetivo

Ajustar o refinamento visual do perfil público do Organizador sem alterar Supabase, permissões ou criação de torneios.

## Alterações

- Card de torneio levemente mais largo, mantendo o formato compacto.
- Informações do card de torneio redistribuídas: jogo, nome, frase curta, participantes/data e botão.
- Frase abaixo do nome do torneio passa a usar campos editáveis quando existirem, como `tagline`, `subtitle`, `shortDescription`, `short_description`, `summary`, `description` ou equivalentes em `metadata/settings`.
- Frase abaixo do nome do organizador passa a priorizar campos editáveis como `tagline`, `slogan`, `headline`, `heroPhrase`, `shortDescription` e depois `description`.
- Logo/avatar no banner ganha aproximadamente 10% de volume visual.
- Rankings passam a renderizar somente Top 5 de jogadores e Top 5 de equipes.
- Mantém posição, nome e pontos, com cores já preparadas para variação positiva/negativa.

## Não altera

- Supabase/RPCs/RLS.
- Criação de organização.
- Criação de torneio.
- Inscrições, chaves ou rankings reais.
