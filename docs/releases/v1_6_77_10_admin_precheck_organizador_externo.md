# v1.6.77.10 — Pré-check Admin Master do organizador externo

## Objetivo

Adicionar uma verificação simples no Admin Master para preparar o teste real com organizadores externos, especialmente a Rinha Online.

## O que mudou

- Adicionado bloco **Pré-check para organizador externo** na aba Organizadores do Admin Master.
- Mostra se já existe permissão ativa para criar Organização de Torneios.
- Reforça a regra correta:
  - conta comum não cria organização;
  - conta comum não cria torneio;
  - conta parceira precisa receber permissão da -SBW-;
  - depois disso, a própria organização cria seu perfil organizacional e seus torneios.
- Adicionado botão **Copiar checklist Admin** para gerar um resumo rápido do estado operacional antes do teste real.
- Mantém o teste da Rinha como fluxo acompanhado pela -SBW-, mas operado pela própria conta autorizada da organização.

## Arquivos alterados

- `admin/admin.html`
- `js/admin/admin-page.js`
- `css/admin.css`
- `docs/releases/v1_6_77_10_admin_precheck_organizador_externo.md`

## Validação manual sugerida

1. Abrir Admin Master.
2. Entrar na aba Organizadores.
3. Confirmar se o bloco Pré-check aparece.
4. Sem organizador autorizado, conferir aviso de pendência.
5. Com organizador autorizado, conferir contagem e checklist.
6. Testar o botão Copiar checklist Admin.

## Observações

Este patch não altera banco, RLS, RPC, Team Battle, inscrições ou check-in. É apenas um apoio operacional para o teste real com organizador externo.
