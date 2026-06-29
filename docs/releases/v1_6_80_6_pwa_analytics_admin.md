# v1.6.80.6 — PWA/App Beta + Analytics Admin

Patch focado em dois blocos pendentes:

1. PWA/App -SBW- Beta
   - Atualiza versão para Site v1.6.80.6 e App -SBW- Beta v0.2.
   - Atualiza cache do service worker para `sbw-pwa-beta-v8`.
   - Atualiza query strings do manifest, service worker e script PWA.
   - Remove trava de orientação `portrait` e usa `orientation: any` para melhorar PC/tablet.
   - Adiciona instrução de instalação no computador na Home.
   - Aplica ajustes responsivos no card do App para reduzir tela torta/estouro lateral no celular.

2. Analytics Admin
   - Adiciona aba Analytics no Admin Master.
   - Mostra cards agregados, gráfico diário em CSS e listas por página, categoria, dispositivo e App/PWA versus navegador.
   - Adiciona RPC `sbw_admin_get_site_analytics_summary(p_days integer)` para leitura agregada segura, sem expor a tabela diretamente.

SQL necessário:

```sql
docs/sql/v1_6_80_6_site_analytics_admin_dashboard.sql
```

Observação: se o App instalado no PC continuar preso em versão antiga, desinstale o app instalado uma vez e instale novamente após o deploy, porque o Windows/Chrome pode manter o manifest antigo do app.
