# v1.6.68.0 — Ranking real do Organizador

## Objetivo

Iniciar a fase de ranking real por Organizador na plataforma -SBW-, usando torneios finalizados e pontuáveis como fonte para a página pública do organizador.

## Alterações

- A página pública do organizador agora carrega `SBWRankingsStorage`.
- A aba e o bloco de Rankings do organizador tentam gerar um snapshot real filtrado pelo organizador atual.
- O ranking real usa os torneios concluídos com resultados finais salvos.
- Mantém ranking de jogadores e equipes.
- Mantém regra de equipes: somente o melhor colocado da equipe em cada torneio conta para a pontuação da equipe.
- Adicionado resumo com torneios pontuáveis, jogadores ranqueados, equipes ranqueadas e horário de atualização.
- Se ainda não houver torneios finalizados/pontuáveis, a página mostra estado vazio sem quebrar.
- Mantido fallback para ranking cadastrado manualmente/metadados do organizador quando não houver snapshot real disponível.

## Arquivos alterados

- `torneios/organizador.html`
- `js/tournaments/tournament-organizer-page.js`
- `css/organizers/organizer-profile.css`
- `docs/releases/v1_6_68_0_organizer_real_rankings.md`

## Páginas para testar

- `/torneios/organizador.html?slug=<slug-do-organizador>`
- `/torneios/organizador.html?slug=<slug-do-organizador>#rankings`
- `/rankings/rankings.html`
- `/torneios/detalhe-torneio.html?id=<id-ou-slug>&view=resultados`

## Observações

Este patch não cria tabelas novas, não altera RLS e não muda Supabase. Ele usa os resultados finais já salvos nos torneios para calcular a classificação pública do organizador.
