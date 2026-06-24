# v1.6.74.0 — Configuração visual do MVP básico Team Battle League 4v4

Este patch inicia uma nova fase mais objetiva para preparar a futura liberação controlada do **Team Battle League 4v4 básica**.

## O que foi adicionado

- Modelo consolidado do MVP básico no helper técnico `team-battle-league.js`.
- Resumo administrativo do MVP básico com requisitos mínimos.
- Card visual do MVP na criação de torneio.
- Card visual do MVP no painel do organizador.
- Card público explicando o MVP básico na página do torneio.
- Reforço da regra: modo básico = divisão única; modo avançado = várias divisões.

## Ainda não libera

- Criação real do formato.
- Inscrições reais de equipes 4v4.
- Check-in real de equipe.
- Resultados reais do Team Battle.
- Novas tabelas Supabase.

## Validação

Validar no navegador/Console as páginas:

- `/torneios/create-tournament/criar-torneio.html`
- `/torneios/editar-organizador.html?slug=<slug-do-organizador>`
- `/torneios/detalhe-torneio.html?id=<id-ou-slug-do-torneio>&view=visao-geral`

Se aparecer apenas `favicon.ico 404`, está ok.
