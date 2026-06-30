# v1.6.80.8 — Analytics com origem aproximada por IP temporário

## Objetivo
Implementar origem aproximada mais precisa no Analytics do Admin Master sem salvar IP bruto no banco da plataforma -SBW-.

## O que mudou
- `js/analytics/sbw-analytics.js` passa a tentar enviar eventos pela Edge Function `sbw-track-site-event`.
- A Edge Function lê o IP somente durante a requisição, consulta localização aproximada e descarta o IP.
- O banco recebe apenas dados agregados no `metadata`, como país, UF/estado e região brasileira.
- Se a Edge Function falhar ou ainda não estiver publicada, o script usa fallback via RPC antiga.
- O painel Admin passa a separar origem por:
  - Países
  - Estados
  - Regiões BR

## Privacidade
- Não salva `ip`, `ip_address`, `client_ip`, `user_agent`, `fingerprint` ou dados pessoais no analytics.
- A localização deve ser tratada como aproximada.
- VPN, proxy, internet móvel e redes corporativas podem distorcer a origem.

## Deploy da Edge Function
Exemplo com Supabase CLI:

```bash
supabase functions deploy sbw-track-site-event --no-verify-jwt
```

A função usa as variáveis padrão da Supabase:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Opcional:
- `SBW_GEO_LOOKUP_ENABLED=true`

## SQL
Rodar no Supabase:

```txt
docs/sql/v1_6_80_8_analytics_ip_geo_ephemeral.sql
```
