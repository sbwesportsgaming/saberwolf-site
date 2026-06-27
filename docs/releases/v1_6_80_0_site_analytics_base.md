# v1.6.80.0 — Base Analytics segura da plataforma -SBW-

## Objetivo

Criar a base inicial de analytics agregada da plataforma -SBW-, sem coletar dados pessoais e sem interferir nos fluxos de torneios, inscrições, check-in, perfis, equipes ou organizadores.

## O que foi adicionado

- Tabela `site_analytics_events`.
- RPC `sbw_track_site_event`.
- Arquivo `js/analytics/sbw-analytics.js`.
- Carregamento automático do analytics a partir de `js/supabase/supabase-client.js`.
- Registro de page views.
- Registro de cliques básicos em navegação/botões marcados.
- Detecção simplificada de:
  - página/categoria;
  - desktop/tablet/mobile;
  - navegador por família;
  - sistema operacional por família;
  - PWA/App -SBW- Beta versus navegador;
  - tamanho de viewport.

## Regras de privacidade

O analytics não coleta:

- nome;
- e-mail;
- IP completo;
- user-agent completo;
- fingerprint;
- ID de usuário;
- ID de perfil;
- dados pessoais de visitantes.

A RPC também remove campos sensíveis caso sejam enviados por engano no metadata.

## Comportamento seguro

- Se Supabase estiver indisponível, o site continua funcionando.
- Se a RPC falhar, o erro é ignorado no front.
- O analytics não bloqueia carregamento de página.
- O analytics não interfere em inscrição, check-in, torneios ou Admin Master.
- Páginas de autenticação, offline e 404 são ignoradas por padrão.

## SQL necessário

Rodar no Supabase:

```sql
-- docs/sql/v1_6_80_0_site_analytics_base.sql
```

## Próxima fase sugerida

- v1.6.81 — Painel Analytics no Admin Master.
