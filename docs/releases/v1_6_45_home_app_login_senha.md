# v1.6.45 — Home CTA App + Login visualizar senha

## Objetivo

Adicionar atalhos pequenos e seguros sem mexer em Supabase, Auth/RLS, convites ou equipes.

## Alterações

- Home: adiciona botão **Baixe o app** no hero principal, ao lado do botão **-SBW-**.
- O botão usa o fluxo PWA existente (`data-sbw-pwa-install` / `data-sbw-install-app`).
- Quando a instalação automática não estiver disponível, o botão leva o usuário para a seção App -SBW- Beta/guia de instalação pelo comportamento atual do script PWA.
- Login/Cadastro: adiciona botão **Mostrar/Ocultar senha** nos campos de senha.

## Arquivos

- `index.html`
- `css/home/home-landing.css`
- `auth/login.html`
- `css/auth.css`

## Não altera

- Supabase
- RLS
- Login social/Auth service
- Admin
- Equipes
- Convites
- Transferências
- Service worker/PWA cache
