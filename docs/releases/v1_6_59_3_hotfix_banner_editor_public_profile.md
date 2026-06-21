# v1.6.59.3 — Hotfix do banner do Organizador

## Objetivo
Corrigir dois problemas encontrados depois da v1.6.59.2:

- o editor de banner no painel interno ficou quebrado/estourando a área de configuração;
- o enquadramento do banner não estava ficando claro no perfil público, parecendo pequeno demais.

## Arquivos alterados
- `css/tournaments/tournament-organizer-admin.css`
- `css/organizers/organizer-profile.css`
- `js/tournaments/tournament-organizer-admin-page.js`
- `js/tournaments/tournament-organizer-page.js`

## Ajustes
- corrige a largura/altura do preview de banner no painel interno;
- remove o comportamento que fazia o preview invadir a coluna de controles;
- mantém o editor de logo como estava;
- melhora a leitura de enquadramento salvo em `metadata.organizerAssets`;
- aplica zoom padrão maior para banner no perfil público;
- adiciona suporte a formatos de metadados aninhados como `frame`, `framing`, `crop` ou `position`.

## Supabase
Não há SQL novo.
