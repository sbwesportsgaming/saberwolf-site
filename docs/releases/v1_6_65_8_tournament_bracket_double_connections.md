# v1.6.65.8 — Ajustes finais de conexão da bracket Double Elimination

## Objetivo

Refinar a visualização pública da aba **Chaves** na página do torneio, mantendo o visual aprovado da plataforma -SBW- e corrigindo os últimos problemas percebidos na Double Elimination.

## Ajustes aplicados

- Correção da lógica de conexão entre rounds do **Lower Bracket**.
- Quando dois rounds consecutivos do Lower Bracket têm a mesma quantidade de partidas, a conexão agora é 1:1, evitando linhas quebradas.
- Quando o round seguinte reduz a quantidade de partidas, a conexão continua agrupando partidas corretamente.
- A **Grand Final** passa a alinhar dinamicamente com a **Winners Final**, ficando logo à frente dela.
- A conexão da **Lower Final** até a **Grand Final** continua existindo como linha de retorno.
- Mantidos rolagem horizontal, rolagem vertical, zoom e busca.
- Mantido o hero/banner reduzido na view de Chaves.

## Arquivos alterados

- `torneios/detalhe-torneio.html`
- `js/tournaments/tournament-detail-page.js`
- `css/tournaments/tournament-detail.css`

## Observações técnicas

- Não houve alteração em Supabase, Auth, RLS, inscrições, check-in, geração real de estrutura, resultados ou painel do organizador.
- A alteração é visual/comportamental apenas na renderização pública da bracket.
