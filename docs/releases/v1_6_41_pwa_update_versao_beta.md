# v1.6.41 — PWA update e versão Beta

Patch focado na PWA/App -SBW- Beta, sem alterar Supabase, Auth, Admin, Perfis, Equipes ou regras de permissão.

## Alterações

- Adiciona aviso discreto de nova versão disponível quando houver service worker novo aguardando ativação.
- Adiciona botão “Atualizar agora” para aplicar a nova versão da PWA e recarregar o app/site.
- Atualiza o service worker para `sbw-pwa-beta-v4`.
- Adiciona suporte a mensagem `SBW_APPLY_UPDATE`/`SBW_SKIP_WAITING` no service worker.
- Exibe versão discreta no rodapé global:
  - `Site v1.6.41 · App -SBW- Beta v0.1`
- Exibe versão também em `offline.html`.
- Atualiza query de versionamento do manifest/script PWA na Home.

## Arquivos

- `index.html`
- `offline.html`
- `service-worker.js`
- `js/pwa/sbw-pwa.js`
- `js/core/sbw-site-compliance.js`
- `css/core/sbw-site-compliance.css`

## Testes recomendados

1. Abrir Home no navegador com cache antigo.
2. Abrir app instalado no PC/Android.
3. Confirmar se aparece aviso “Nova versão disponível” quando houver atualização aguardando.
4. Clicar em “Atualizar agora”.
5. Confirmar recarregamento com versão nova.
6. Verificar rodapé com versão discreta.
7. Testar login, perfil, equipes e admin apenas para confirmar que a PWA não interferiu.

## Observação

Ícone do app já instalado pode continuar antigo por cache do sistema Android/Chrome. Nesses casos, remover e instalar novamente continua sendo o teste mais confiável.
