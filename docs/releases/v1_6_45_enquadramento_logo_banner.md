# v1.6.45 — Enquadramento de logo e banner da equipe

Esta etapa adiciona controles de enquadramento para as imagens de equipe já enviadas ao Supabase Storage.

## Inclui

- Zoom do banner.
- Posição horizontal do banner.
- Posição vertical do banner.
- Zoom da logo.
- Posição horizontal da logo.
- Posição vertical da logo.
- Salvamento do enquadramento em `teams.metadata.teamAssets`.
- Leitura do enquadramento no painel Minha Equipe e no perfil público da equipe.

## Não inclui

- Novo bucket.
- Alteração de permissões de Storage.
- Crop real de arquivo.
- Reprocessamento/compactação da imagem.
- Edição mobile avançada.

## SQL necessário

Rodar `docs/sql/v1_6_45_team_asset_settings.sql` antes de testar o patch.
