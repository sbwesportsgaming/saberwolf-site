# v1.6.76.5 — Status operacional das partidas Team Battle League 4v4

## Objetivo

Refinar a agenda livre do Team Battle League 4v4 para que o organizador tenha controle claro sobre o andamento operacional de cada confronto.

## O que foi adicionado

- Resumo de status no painel do organizador para partidas 4v4:
  - A definir;
  - Agendadas;
  - Ao vivo;
  - Adiadas/remarcando;
  - Finalizadas;
  - Canceladas.
- Destaque visual por status em cada confronto da agenda editável.
- Conversão do status de agenda para status operacional interno do confronto:
  - `scheduled` → confronto pronto;
  - `live` → confronto em andamento;
  - `finished` → confronto finalizado;
  - `postponed`, `cancelled` ou `to_define` → rascunho/pendente.
- Preservação de resultado finalizado: se um confronto já tiver resultado finalizado, o status operacional continua finalizado.
- Resumo público dos status da agenda no detalhe do torneio.
- Lista pública de próximos confrontos agendados/ao vivo quando houver dados.
- Badges públicos nos confrontos da rodada gerada.

## Regras mantidas

- Não cria equipe fake/demo.
- A agenda só aparece sobre confrontos reais gerados.
- Folga técnica continua sendo apenas folga, sem pontuação automática.
- O organizador continua com autonomia para remarcar partidas por ser uma liga longa.
- Os Playoffs -SBW- continuam usando classificação real da Divisão Única.

## Arquivos alterados

```txt
js/tournaments/team-battle-league.js
js/tournaments/tournament-detail-page.js
js/tournaments/tournament-organizer-admin-page.js
css/tournaments/tournament-detail.css
css/tournaments/tournament-organizer-admin.css
```

## Validação recomendada

```powershell
git diff --check -- js/tournaments/team-battle-league.js js/tournaments/tournament-detail-page.js js/tournaments/tournament-organizer-admin-page.js css/tournaments/tournament-detail.css css/tournaments/tournament-organizer-admin.css docs/releases/v1_6_76_5_team_battle_status_operacional.md
```

Depois, testar no navegador:

```txt
Painel do organizador → torneio Team Battle 4v4 → Agenda 4v4
Página pública do torneio → visão geral/rodada gerada
Console do navegador sem erro crítico
```
