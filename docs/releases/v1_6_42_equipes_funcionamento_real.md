# -SBW- v1.6.42 — Equipes funcionamento real

## Objetivo
Corrigir o fluxo real de edição/visualização de equipes sem depender de fallback local.

## Incluído
- Botão `Minha equipe` no perfil público da equipe somente para usuário logado com vínculo real com aquela equipe.
- Botão oculto para visitante/deslogado.
- RPC `public.sbw_update_team_public_profile(...)` para salvar nome/tag/descrição pública da equipe sem cair em fallback silencioso.
- Correção da ambiguidade SQL em `primary_color`/`secondary_color` usando parâmetros prefixados com `p_`.
- Aba do painel da equipe renomeada de `Perfil público` para `Editar perfil`.
- Botão do banner renomeado de `Editar identidade` para `Editar perfil`.
- Perfil público da equipe com nome um pouco menor, tag oficial abaixo do nome e ações do banner mais baixas.

## Arquivos
- `js/teams/team-profile-page.js`
- `js/teams/team-admin-page.js`
- `css/teams.css`
- `docs/sql/v1_6_42_team_public_profile_update.sql`

## Testes
- Abrir perfil público da equipe logado: deve aparecer `Minha equipe`.
- Abrir perfil público deslogado: não deve aparecer `Minha equipe`.
- Editar tag em `Minha equipe > Editar perfil`: deve salvar e permanecer após recarregar.
- Conferir visual do banner público da equipe: nome menor, tag abaixo, botões sem cobrir o nome.
