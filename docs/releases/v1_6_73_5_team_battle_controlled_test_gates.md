# v1.6.73.5 — Etapas de teste controlado Team Battle League 4v4

Este patch consolida a próxima camada visual e técnica do formato **Team Battle League 4v4**, sem liberar criação real.

## O que mudou

- Adicionado pacote técnico de teste controlado no helper `SBWTeamBattleLeague`.
- Criadas etapas visuais para validação antes da liberação real:
  - estrutura da liga;
  - inscrições de equipes;
  - escalações 3 + 1;
  - check-in de equipe;
  - resultados e classificação;
  - liberação pública bloqueada.
- A criação de torneio passa a mostrar as etapas planejadas quando o formato Team Battle League 4v4 estiver selecionado.
- O painel do organizador ganhou uma área administrativa de teste controlado.
- A página pública do torneio mostra as etapas de validação antes da liberação pública.

## Regra mantida

```txt
Team Battle League 4v4 básica = divisão única
Team Battle League 4v4 avançada = várias divisões
```

## Importante

O formato continua em preparação.

Este patch não ativa:

- criação real do formato;
- inscrições reais de equipes 4v4;
- check-in real de equipes 4v4;
- resultados reais do Team Battle;
- modo avançado com várias divisões.

## Arquivos alterados

```txt
js/tournaments/team-battle-league.js
js/tournaments/tournament-admin-page.js
js/tournaments/tournament-organizer-admin-page.js
js/tournaments/tournament-detail-page.js
css/tournaments/tournament-organizer-admin.css
css/tournaments/tournament-detail.css
```
