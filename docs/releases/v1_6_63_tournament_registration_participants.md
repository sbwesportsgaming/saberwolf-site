# v1.6.63 — Inscrições e Participantes no Torneio

## Objetivo

Refinar a experiência pública de inscrição e participantes no novo visual premium da página de torneio.

## Alterações

- Melhor visual para status de inscrição: aberta, fechada, lotada ou em preparação.
- Card de inscrição com progresso de vagas, conta/login, check-in e participantes.
- Botão de inscrição com ícone e estados mais claros.
- Participantes reais exibidos com card premium.
- Cards de participantes mostram seed/posição, nome, equipe, origem e status de check-in.
- Resumo da aba Participantes com inscritos, check-in confirmado, lista de espera e status da inscrição.
- Estado vazio mais claro quando ainda não existem participantes.
- Mantém o fluxo existente de inscrição real via Supabase/tournament_participants.
- Não altera RLS, SQL, chaves, resultados ou gestão interna do organizador.

## Arquivos alterados

- `torneios/detalhe-torneio.html`
- `js/tournaments/tournament-detail-page.js`
- `css/tournaments/tournament-detail.css`

## Teste recomendado

1. Abrir uma página pública de torneio.
2. Conferir a aba Participantes com e sem inscritos reais.
3. Conferir a aba Inscrição com torneio aberto, fechado e lotado quando possível.
4. Testar inscrição com usuário logado.
5. Conferir se o participante aparece no novo card após inscrição.
6. Conferir se a página continua com sidebar e visual premium.
