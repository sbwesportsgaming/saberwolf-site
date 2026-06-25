# v1.6.76.6 — Resultados editáveis do Team Battle League 4v4

## Objetivo

Adicionar lançamento de resultados dos confrontos reais do **Team Battle League 4v4** no painel do organizador, mantendo o formato como campeonato longo e sem depender do fluxo de torneio rápido.

## O que foi implementado

- Novo botão **Resultados 4v4** nos torneios Team Battle League 4v4 do painel do organizador.
- Novo painel operacional para lançar placares por confronto real da Divisão Única.
- Campos por confronto:
  - vencedor da Partida 1;
  - placar da Partida 1;
  - vencedor da Partida 2;
  - placar da Partida 2;
  - vencedor da Partida 3;
  - placar da Partida 3;
  - partida extra opcional de desempate.
- Pontuação preservada:
  - Partida 1 = 10 pontos;
  - Partida 2 = 10 pontos;
  - Partida 3 = 20 pontos;
  - Partida extra = +10 pontos quando necessária.
- Salvamento em `settings.teamBattleLeague` e `metadata.teamBattleLeague`.
- Os resultados salvos alimentam:
  - status do confronto;
  - classificação da Divisão Única;
  - liberação futura dos playoffs -SBW- quando a fase classificatória estiver finalizada.

## Regras respeitadas

- Não cria equipe fake/demo.
- Só lista confrontos reais gerados após check-in.
- Folga técnica não aparece como confronto nem recebe resultado.
- Partida extra é opcional e só deve ser usada quando as 3 partidas principais empatarem em pontos.
- A agenda livre continua preservada junto com os resultados.

## Arquivos alterados

```txt
js/tournaments/tournament-organizer-admin-page.js
css/tournaments/tournament-organizer-admin.css
torneios/editar-organizador.html
docs/releases/v1_6_76_6_team_battle_resultados_editaveis.md
```

## Validação recomendada

```powershell
git diff --check
```

Depois testar no navegador:

```txt
Painel do organizador → Torneios → Team Battle League 4v4 → Resultados 4v4
```

Se aparecer apenas `favicon.ico 404`, pode ignorar.
