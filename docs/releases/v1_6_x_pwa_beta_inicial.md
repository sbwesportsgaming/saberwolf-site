# v1.6.x — PWA Beta Inicial

Primeira versão de suporte PWA da plataforma -SBW-.

## Objetivo

Permitir que o site oficial seja instalado no celular como um app, mantendo o funcionamento atual do site e do Supabase.

## Inclui

- `manifest.webmanifest`
- `service-worker.js`
- `offline.html`
- ícones PWA em `assets/icons/`
- card/seção na Home: App -SBW- Beta
- instruções Android/iPhone
- JS pequeno para prompt de instalação e registro do service worker

## Não inclui

- notificações push
- Firebase
- OneSignal
- Supabase Edge Functions
- novas tabelas
- APK
- publicação em lojas
- cache agressivo
- alteração em páginas internas

## Cache

O cache é conservador. O service worker pré-cacheia apenas arquivos da PWA: página offline, manifesto e ícones. Navegação continua network-first e usa `offline.html` apenas em falha de rede.
