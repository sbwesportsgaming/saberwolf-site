# v1.6.69.0 — Temporadas reais do Organizador

## Objetivo

Iniciar a fase de temporadas reais do organizador com validações e leitura mais segura no painel interno.

## Alterações

- Refinada a área **Temporadas** do painel do organizador.
- Adicionada descrição explicando que a temporada pertence ao ecossistema da plataforma -SBW-.
- Adicionado painel de controle da temporada atual com:
  - nome da temporada;
  - período;
  - duração em dias;
  - limite máximo de 1 ano;
  - torneios vinculados;
  - torneios pontuáveis.
- Adicionada validação para impedir temporada maior que 1 ano.
- Mantida validação para impedir data final anterior à data inicial.
- Adicionada proteção ao encurtar temporada: se houver torneios vinculados depois da nova data final, o salvamento é bloqueado.
- A identificação de torneios vinculados considera nome de temporada e, quando não existir, tenta usar o período configurado.

## Arquivos alterados

- `torneios/editar-organizador.html`
- `js/tournaments/tournament-organizer-admin-page.js`
- `css/tournaments/tournament-organizer-admin.css`

## Observações

Este patch não cria tabelas novas e não altera Supabase/RLS. A temporada continua sendo salva no metadata do organizador, preparando a base para evolução posterior com temporadas mais completas.
