# v1.6.67.1 — Organização do torneio, regras por fase e participantes em lista

## Objetivo

Refinar pontos identificados durante os primeiros testes reais da v1.6.67, sem avançar ainda na validação completa de resultados reais com múltiplos participantes.

## Alterações

- Painel de criação/gestão de torneios:
  - cada torneio salvo agora exibe a organização responsável;
  - adiciona chave/slug da organização quando disponível;
  - ajuda Admin Master a diferenciar torneios de organizações diferentes;
  - preserva a lógica de acesso por organização já existente.

- Regras de partidas por fase:
  - adicionada área “Regras por fase” na criação do torneio;
  - formato padrão continua valendo para o torneio inteiro;
  - adicionados presets para fases finais;
  - permitido configurar Top 8, Top 4, Final/Winners Final e Grand Final/Reset;
  - regras são salvas em `settings.phaseRules` e `settings.matchPhaseRules`;
  - check-in passa a ficar obrigatório no formulário de criação.

- Participantes públicos:
  - lista pública trocada de cards grandes para lista limpa;
  - nome do participante pode exibir tag da equipe automaticamente quando o dado estiver disponível;
  - exemplo: `-SBW- D'Lucca`;
  - removida label pública “Inscrição real”;
  - mantidos status úteis como “Check-in pendente” ou “Check-in confirmado”.

## Observações

- A tag da equipe é lida de campos reais do participante/equipe quando disponíveis, como `teamTag`, `team_tag`, `team.tag`, `team.shortName`, `team.abbr`, `raw.team_tag` ou `metadata.teamTag`.
- Se o usuário não tiver equipe/tag carregada no participante, a lista exibe apenas o nick.
- Esta etapa não cria SQL, não altera RLS e não modifica Supabase diretamente.
- A progressão Double Elimination da v1.6.67.0 continua aguardando teste real com múltiplos participantes.

## Arquivos alterados

- `css/tournaments/tournament-detail.css`
- `js/tournaments/tournament-admin-page.js`
- `js/tournaments/tournament-detail-page.js`
- `torneios/create-tournament/criar-torneio.html`
- `torneios/detalhe-torneio.html`
