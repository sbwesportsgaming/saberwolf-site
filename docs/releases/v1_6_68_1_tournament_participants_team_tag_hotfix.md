# v1.6.68.1 — Hotfix tag de equipe nos participantes

## Objetivo

Corrigir a lista pública de participantes do torneio para voltar a exibir automaticamente a tag da equipe vinculada ao jogador na plataforma -SBW-.

## Ajustes

- A busca real de participantes no Supabase agora também carrega `auth_user_id`.
- A lista de participantes passa a tentar enriquecer os inscritos reais com dados de `team_members` e `teams`.
- Quando o jogador estiver vinculado a uma equipe ativa, a tag configurada pela equipe é adicionada ao participante.
- O nome público continua seguindo a regra:

```txt
<tag da equipe> + nick do jogador
```

Exemplo:

```txt
-SBW- D'Lucca
```

- Se não houver equipe/tag vinculada, o nick continua aparecendo normalmente.
- Atualizado cache busting da página pública de detalhe do torneio para garantir que o navegador carregue o storage corrigido.

## Arquivos alterados

- `js/tournaments/tournaments-storage.js`
- `torneios/detalhe-torneio.html`

## Não alterado

- Supabase/RLS/SQL.
- Ranking real do organizador da v1.6.68.0.
- Progressão Double Elimination.
- Bracket pública aprovada.
- Painel do organizador.
