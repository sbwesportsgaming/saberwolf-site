# v1.6.65.6 — Bracket Double Elimination no modelo visual de referência

Esta versão refina a visualização pública da aba **Chaves** do torneio na plataforma -SBW-, tomando como base o modelo visual aprovado para bracket Double Elimination.

## Objetivo

Ajustar a bracket para ficar mais limpa, compacta e profissional, com leitura próxima de plataformas como start.gg/Challonge, mas mantendo a identidade dark premium ciano/azul da plataforma -SBW-.

## Ajustes principais

- Removido o comportamento de arrastar/puxar a bracket.
- Mantida navegação por rolagem horizontal e vertical dentro da área da chave.
- Mantido controle de zoom.
- Mantida busca por jogador/equipe.
- Cards de partidas simplificados:
  - sem cabeçalho interno com fase em cada card;
  - seed discreta;
  - nome como foco principal;
  - placar à direita;
  - visual mais limpo e compacto.
- Rótulos como Oitavas/Quartas/Semifinal/Final não ficam mais dentro dos cards.
- Cabeçalhos de rounds passam a usar labels neutras por coluna, como `ROUND 1 (BO3)`, `WINNERS FINAL (BO5)` e `LOWER FINAL (BO3)`.
- Conectores da bracket refeitos via SVG dinâmico:
  - linhas saem do centro do card anterior;
  - chegam ao centro do card seguinte;
  - Winners usa conexão ciano;
  - Lower usa conexão mais discreta;
  - ligação com Grand Final foi preparada.
- Estrutura Double Elimination reorganizada em uma board única:
  - Winners Bracket;
  - Lower Bracket;
  - Grand Final à direita.
- Skeleton de Lower Bracket gerado com mais rounds para ficar mais próximo de uma Double Elimination real em base 16.

## Arquivos alterados

- `torneios/detalhe-torneio.html`
- `js/tournaments/tournament-detail-page.js`
- `css/tournaments/tournament-detail.css`

## Preservações

Esta versão não altera Supabase, Auth, RLS, inscrições, check-in, geração real de estrutura, resultados nem painel do organizador.
