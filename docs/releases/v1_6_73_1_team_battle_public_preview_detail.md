# v1.6.73.1 — Prévia pública Team Battle League 4v4 no torneio

## Objetivo

Adicionar uma primeira visualização pública do formato **Team Battle League 4v4** dentro da página de detalhe do torneio, sem liberar criação real do formato.

## O que mudou

- A página pública do torneio agora carrega `team-battle-league.js`.
- O card **Formato competitivo** passa a exibir uma prévia especial quando o formato for `team-battle-league-4v4`.
- A prévia pública mostra:
  - modo básico com divisão única;
  - confronto Equipe A vs Equipe B;
  - equipes com 4 jogadores;
  - 3 titulares + 1 reserva;
  - pontuação 10 / 10 / 20;
  - partida extra de 10 pontos em caso de empate;
  - avisos de transparência sobre o formato ainda estar em preparação.

## Regra mantida

- **Team Battle League 4v4 básica** = uma divisão única.
- **Team Battle League 4v4 avançada** = várias divisões.

## Segurança

- Não libera criação real do formato.
- Não altera Supabase, Auth, RLS, inscrições, check-in, bracket, resultados ou Ranking Global.
- A prévia é pública/visual e usa fallback seguro caso o helper técnico ainda não esteja disponível.

## Testes sugeridos

- `/torneios/detalhe-torneio.html?id=<id-ou-slug-do-torneio>&view=visao-geral`
- Validar Console do navegador.
- Se aparecer apenas `favicon.ico 404`, está ok.
