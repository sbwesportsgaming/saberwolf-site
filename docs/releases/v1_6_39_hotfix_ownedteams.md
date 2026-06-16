# v1.6.39 — Hotfix Minha Equipe: ownedTeams

Correção pontual para o painel Minha Equipe.

## Corrigido

- Restaura a declaração `const ownedTeams = getOwnedTeams();` durante o carregamento inicial do painel.
- Corrige o erro `ownedTeams is not defined`.

## Escopo

- Não altera Supabase.
- Não altera RLS.
- Não altera permissões.
- Não altera sidebar global.
- Não implementa upload de imagem.
