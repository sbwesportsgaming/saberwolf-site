# v1.6.76.0 — Playoffs -SBW- do Team Battle League 4v4

## Objetivo

Programar a base funcional dos playoffs do **Team Battle League 4v4** no padrão inspirado na **modelo em escada da -SBW-**, mantendo o MVP básico em Divisão Única e sem criar equipes demo/fake.

## O que mudou

- O Team Battle League 4v4 agora possui um plano de playoffs próprio no helper central `team-battle-league.js`.
- O modo básico usa o modelo **-SBW- em escada Top 4**:
  - Quartas: 3º colocado x 4º colocado;
  - Semifinal: 2º colocado x vencedor das quartas;
  - Grande Final: 1º colocado x vencedor da semifinal;
  - Quartas e semifinal em **FT50**;
  - Grande Final em **FT70**;
  - Sem partida extra nos playoffs.
- O modo avançado fica preparado para o modelo **Top 3 por divisão**:
  - 2º x 3º da divisão;
  - vencedor enfrenta o 1º da divisão;
  - campeões de divisão podem avançar para Grande Final avançada em FT90.
- A página pública do torneio exibe uma prévia clara dos playoffs, com regras e status.
- O painel do organizador exibe o bloco de playoffs -SBW-, sem liberar ainda lançamento completo operacional de resultados.
- A tela de criação informa que o formato está em beta controlado e mostra o modelo de playoffs esperado.
- O catálogo de formatos foi atualizado para indicar suporte ao playoff -SBW-.

## Arquivos alterados

```txt
js/tournaments/team-battle-league.js
js/tournaments/tournament-detail-page.js
js/tournaments/tournament-organizer-admin-page.js
js/tournaments/tournament-admin-page.js
js/tournaments/tournament-formats.js
css/tournaments/tournament-detail.css
css/tournaments/tournament-organizer-admin.css
torneios/detalhe-torneio.html
torneios/editar-organizador.html
torneios/create-tournament/criar-torneio.html
docs/releases/v1_6_76_0_team_battle_sfl_playoffs.md
```

## Regras preservadas

- Sem equipe demo/fake.
- Sem placeholders como participantes reais.
- Equipes reais continuam aparecendo somente depois do check-in.
- O MVP básico continua limitado à Divisão Única.
- O lançamento completo de resultados dos playoffs fica para uma próxima etapa operacional.

## Validação sugerida

1. Abrir a criação de torneio e selecionar **Team Battle League 4v4 (beta controlado)**.
2. Conferir se a prévia mostra playoffs -SBW- em escada.
3. Abrir a página pública de um torneio Team Battle League 4v4.
4. Conferir o bloco de playoffs:
   - antes do check-in: aguardando tabela/classificação real;
   - após equipes reais: Top 4 e escada -SBW-;
   - sem equipes demo/fake.
5. Abrir o painel do organizador e conferir o bloco de playoffs -SBW-.
6. Validar Console do navegador. `favicon.ico 404` pode ser ignorado.
