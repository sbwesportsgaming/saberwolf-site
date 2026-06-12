# -SBW- / SaberWolf Site — v1.6.30 Manifesto de upload consolidado

Este arquivo resume a fase estrutural/visual trabalhada de v1.6.12 até v1.6.30.

## Status

- Teste local no VS Code: feito por etapas pelo usuário.
- Upload GitHub: ainda não realizado nesta fase.
- Objetivo: usar este manifesto como referência para o próximo pente fino antes de subir no GitHub.

## Arquivos novos importantes criados na fase

```txt
js/core/sbw-session-context.js
js/core/sbw-page-state.js
js/core/sbw-routes.js
js/core/sbw-site-compliance.js

css/core/sbw-page-state.css
css/core/sbw-site-compliance.css

admin/admin.html
css/admin.css
js/admin/admin-page.js

pages/termos.html
pages/privacidade.html
pages/cookies.html
css/legal.css

css/comunidades.css
js/communities/communities-page.js

css/noticias.css
js/news/news-page.js

css/loja.css
js/store/store-page.js

css/transfers/transfers.css
js/transfers/transfers-page.js

assets/images/logo-sbw.jpg
assets/images/placeholder-news.png
assets/images/dlucca-avatar.jpg
assets/images/kari-akane-avatar.jpg
assets/images/elitz-avatar.jpg
assets/images/tigerfurious-avatar.jpg
assets/images/fighting-girls-logo.jpeg
```

## Áreas alteradas na fase

```txt
index.html
auth/login.html

admin/admin.html

pages/sobre.html
pages/loja.html
pages/termos.html
pages/privacidade.html
pages/cookies.html

blog/noticias.html
blog/noticia.html

comunidades/comunidades.html
transferencias/transferencias.html

perfis/perfis.html
perfis/perfil.html
perfis/meu-perfil.html

equipes/equipes.html
equipes/equipe.html
equipes/criar-equipe.html
equipes/minha-equipe.html

rankings/rankings.html

torneios/torneios.html
torneios/detalhe-torneio.html
torneios/organizador.html
torneios/editar-organizador.html
torneios/create-tournament/criar-torneio.html

creators/creator-elitz.html
```

## CSS/JS principais alterados

```txt
css/layout/sbw-sidebar.css
css/core/sbw-site-compliance.css
css/teams.css
css/profiles.css
css/profiles-directory.css
css/rankings.css
css/torneios.css
css/sobre.css
css/comunidades.css
css/noticias.css
css/loja.css
css/transfers/transfers.css

js/layout/sbw-sidebar.js
js/core/sbw-session-context.js
js/core/sbw-page-state.js
js/core/sbw-routes.js
js/core/sbw-site-compliance.js

js/teams/teams-storage.js
js/teams/team-create-page.js
js/teams/team-admin-page.js
js/teams/team-list-page.js
js/teams/team-profile-page.js

js/profiles/profiles-storage.js
js/profiles/profile-admin-page.js
js/profiles/profile-public-page.js
js/profiles/profiles-list-page.js

js/rankings/rankings-page.js
js/tournaments/tournaments-list-page.js
js/admin/admin-page.js
js/communities/communities-page.js
js/news/news-page.js
js/store/store-page.js
js/transfers/transfers-page.js
```

## Pendências conhecidas para o próximo pente fino

```txt
- Ajustes visuais finos em páginas que ainda ficaram fora de eixo.
- Teste online real de aceitar/recusar convites com contas Supabase reais.
- Conferir se permissões Master/Admin estão salvas de forma padronizada no Supabase.
- Revisar visual final do Admin Master.
- Validar upload final no sbwgg.com.br antes de liberar para testadores.
```

## Observação

Este manifesto é uma referência. Antes do upload final, gerar nova lista a partir do ZIP final real do projeto para evitar esquecer arquivos alterados localmente depois desta etapa.
