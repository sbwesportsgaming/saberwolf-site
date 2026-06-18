# -SBW- v1.6.38.7 — Competidor em evidência sem rebarba

## Objetivo
Corrigir a rebarba/corte visual no banner do card "Competidor em evidência" da página Perfis.

## Arquivos alterados
- `js/profiles/profiles-list-page.js`
- `css/profiles-directory.css`

## Ajustes
- Separa a URL pura do banner em `--profile-banner-image`.
- Usa uma camada própria `::after` para o banner no destaque.
- Mantém overlay escuro acima da imagem para legibilidade.
- Evita linhas aparentes e cortes no card principal.
- Não altera Supabase, Auth, RLS, Storage ou SQL.
