# -SBW- v1.6.40.4 — PWA cache/versionamento

## Objetivo
Melhorar a atualização da PWA/App instalado para reduzir casos em que um perfil do Chrome ou app instalado continua exibindo imagem/ícone antigo mesmo após o GitHub Pages já ter atualizado.

## Arquivos alterados
- `index.html`
- `manifest.webmanifest`
- `service-worker.js`
- `js/pwa/sbw-pwa.js`
- `css/home/home-landing.css`
- `assets/icons/icon-192-v3.png`
- `assets/icons/icon-512-v3.png`
- `assets/icons/apple-touch-icon-v3.png`
- `assets/images/app-sbw-beta-promo-v2.png`

## Ajustes
- Atualiza cache da PWA para `sbw-pwa-beta-v3`.
- Remove caches antigos no `activate`.
- Mantém páginas HTML em estratégia network-first.
- Mantém cache apenas para assets estáticos da PWA.
- Troca o mockup da Home para arquivo versionado `app-sbw-beta-promo-v2.png`.
- Troca ícones do manifest para arquivos versionados `icon-192-v3.png`, `icon-512-v3.png` e `apple-touch-icon-v3.png`.
- Registra o service worker com `updateViaCache: 'none'` e URL versionada.
- Mantém a imagem promocional maior na Home conforme v1.6.40.3.

## Observações
O ícone de PWA já instalado pode continuar preso no cache do sistema operacional. Para validar ícone novo, remover o app instalado e instalar novamente pode ser necessário.

## Não altera
- Supabase
- Auth/Login
- RLS
- Admin
- Perfis
- Equipes
- dados privados/dinâmicos
