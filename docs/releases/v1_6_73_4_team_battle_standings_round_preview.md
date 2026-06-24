# v1.6.73.4 — Prévia de classificação e rodada Team Battle League 4v4

Este patch consolida mais uma camada visual da fase v1.6.73 para o formato **Team Battle League 4v4**, sem liberar criação real do formato.

## O que mudou

- Adicionado modelo técnico de prévia visual da divisão única no helper `SBWTeamBattleLeague`.
- A página pública do torneio agora pode mostrar:
  - classificação prevista da divisão única;
  - primeira rodada com confrontos de exemplo;
  - modo básico com divisão única;
  - estado visual preparado para quando existirem equipes reais.
- O painel do organizador ganhou a mesma prévia administrativa:
  - classificação da divisão única;
  - rodada inicial;
  - reforço visual do modo básico.
- Mantida a separação:
  - **Team Battle League 4v4 básica** = divisão única;
  - **Team Battle League 4v4 avançada** = várias divisões.

## Arquivos alterados

```txt
js/tournaments/team-battle-league.js
js/tournaments/tournament-detail-page.js
js/tournaments/tournament-organizer-admin-page.js
css/tournaments/tournament-detail.css
css/tournaments/tournament-organizer-admin.css
docs/releases/v1_6_73_4_team_battle_standings_round_preview.md
```

## Observações

- O formato continua como **em preparação**.
- Não libera criação real do Team Battle League 4v4.
- Não altera Supabase, Auth, RLS, inscrições reais, check-in real, bracket, Ranking Global ou Admin Master.
