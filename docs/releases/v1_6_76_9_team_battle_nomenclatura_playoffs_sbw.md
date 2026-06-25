# v1.6.76.9 — Nomenclatura própria dos playoffs Team Battle 4v4

## Objetivo

Remover a identificação pública de marcas/referências externas dos torneios Team Battle League 4v4 e padronizar a fase final como **Playoffs -SBW- em escada**.

## Regra consolidada

- Páginas públicas e telas de torneio não devem usar nomes de marcas externas como nome do formato.
- A estrutura competitiva continua usando o modelo em escada: Top 4, 3º x 4º, vencedor contra 2º e Grande Final contra 1º.
- Quartas/Semifinal continuam em FT50.
- Grande Final continua em FT70.
- Não existe partida extra nos playoffs.
- Referências técnicas internas podem continuar existindo em nomes de funções/constantes para compatibilidade com patches anteriores, mas a comunicação ao usuário usa marca própria da plataforma -SBW-.

## Arquivos alterados

- `js/tournaments/team-battle-league.js`
- `js/tournaments/tournament-detail-page.js`
- `js/tournaments/tournament-organizer-admin-page.js`
- `js/tournaments/tournament-admin-page.js`
- `js/tournaments/tournament-formats.js`
- `css/tournaments/tournament-detail.css`
- `css/tournaments/tournament-organizer-admin.css`
- `torneios/editar-organizador.html`

## Validação sugerida

1. Abrir criação/edição de torneio Team Battle League 4v4.
2. Confirmar que a tela fala em **Playoffs -SBW-** ou **escada -SBW-**.
3. Abrir página pública do torneio.
4. Confirmar que não aparecem nomes de marcas externas nas áreas públicas do torneio.
5. Rodar no PowerShell:

```powershell
git diff --check
git status --short
```
