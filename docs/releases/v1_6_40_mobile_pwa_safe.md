# -SBW- v1.6.40 — Mobile/tablet + PWA segura

Patch pequeno e conservador após a publicação da PWA Beta preview.

## Arquivos alterados

- `css/home/home-landing.css`
- `service-worker.js`

## Ajustes

- Adiciona guardas leves contra rolagem horizontal na Home.
- Melhora o encaixe do bloco “App -SBW- Beta” em tablet e mobile.
- Garante `min-width: 0` nos elementos internos do card PWA para evitar estouro lateral.
- Reduz largura e altura visual da arte promocional em telas menores.
- Atualiza o cache da PWA para `sbw-pwa-beta-v2`.
- Inclui `assets/images/app-sbw-beta-promo.png` no cache estático conservador da PWA.

## Restrições mantidas

- Não altera Supabase/Auth/RLS/Admin/Perfis/Equipes.
- Não cacheia páginas privadas, dados dinâmicos, Supabase, Admin ou login.
- Mantém navegação offline apenas com fallback para `offline.html`.
