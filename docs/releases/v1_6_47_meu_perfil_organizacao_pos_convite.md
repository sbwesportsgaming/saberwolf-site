# v1.6.47 — Meu Perfil organizado e atualização pós-convite

## Objetivo

Refinar a experiência do Meu Perfil sem alterar a lógica validada de convites, equipes, Supabase, RLS ou `team_members`.

## Alterações

- Adiciona uma aba inicial **Dados públicos** com resumo do perfil.
- Move a edição completa para a aba **Editar perfil**.
- Adiciona a aba **Minha equipe** para visualizar e atualizar o vínculo competitivo.
- Mantém **Convites**, **Status**, **Medalhas** e **Histórico** separados.
- Remove a opção visível **Creator** do seletor de tipo de perfil por enquanto.
- Ajusta a mensagem e o comportamento após aceitar convite: o painel limpa cache de contexto, espera brevemente e abre a aba **Minha equipe**.
- Ordena os jogos principais em ordem alfabética na edição.
- Ajusta textos para usar **usuário SBW** em vez de tratar todo usuário como SaberWolf.

## Fora do escopo

- Não altera RPCs de convite.
- Não altera Supabase/RLS.
- Não altera criação, cancelamento ou aceite real de convites.
- Não altera `team_members`.
- Não altera Admin.
