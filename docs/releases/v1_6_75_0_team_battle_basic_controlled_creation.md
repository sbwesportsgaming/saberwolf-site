# v1.6.75.0 — Criação controlada do MVP básico Team Battle League 4v4

## Objetivo

Liberar a criação controlada do MVP básico do formato Team Battle League 4v4, mantendo o escopo eficiente definido para a plataforma -SBW-.

## Regra aplicada

- Team Battle League 4v4 básica = Divisão Única.
- Team Battle League 4v4 avançada = várias divisões, reservada para etapa futura.
- Não usar equipes demo/fake.
- A tabela pública nasce vazia após a criação do torneio.
- As equipes reais só aparecem após o encerramento do check-in.

## Alterações

- O catálogo de formatos passa a tratar `team-battle-league-4v4` como `beta` controlado.
- `SBWTournamentFormats.canCreate()` passa a permitir formatos `active` e `beta`.
- A criação do torneio não bloqueia mais o Team Battle League 4v4 básico.
- O payload criado salva metadados limpos do MVP básico em `settings.teamBattleLeague` e `metadata.teamBattleLeague`.
- A prévia de criação foi ajustada para explicar que o MVP básico está em beta controlado.
- O painel do organizador também passa a reconhecer o estado `beta`.
- A base técnica ganhou helpers para montar o payload de criação controlada e o aviso operacional.

## Fora do escopo

- Não implementa modo avançado com várias divisões.
- Não cria equipes demo.
- Não cria inscrições falsas.
- Não cria check-in falso.
- Não altera Supabase, RLS ou Auth.
- Não muda ranking global, bracket atual ou Admin Master.

## Testes sugeridos

- Abrir `/torneios/create-tournament/criar-torneio.html`.
- Selecionar `Team Battle League 4v4`.
- Confirmar que o formato aparece como beta controlado, não como bloqueado.
- Criar torneio de teste apenas se estiver validando localmente.
- Abrir o detalhe do torneio e confirmar que a tabela aparece vazia antes do check-in.
