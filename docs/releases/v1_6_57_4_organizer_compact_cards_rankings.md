# v1.6.57.4 — Cards compactos e rankings enxutos do Organizador

## Objetivo
Refinar o perfil público do Organizador após validação visual, reduzindo a presença dos cards de torneio e deixando o bloco de rankings mais direto.

## Alterações
- Reduzidos os cards de torneio em aproximadamente 60% na área do Organizador.
- Cards passam a mostrar apenas informações essenciais: jogo, nome, participantes/data e botão “Ver torneio”.
- Ranking de jogadores e ranking de equipes ficam enxutos.
- Removida coluna de torneios no ranking.
- Ranking passa a exibir posição, nome e pontos.
- Pontos positivos aparecem em verde com prefixo `+`.
- Posição exibe seta verde para subida e seta vermelha para queda quando houver variação nos dados.
- Mantida estrutura vazia preparada para quando as pontuações reais forem implementadas.

## Observações
- Não altera Supabase, RPCs, RLS, criação de organização, criação de torneio, inscrições ou cálculo real de pontuação.
- A movimentação de posição depende de campos futuros como `positionDelta`, `rankDelta`, `previousPosition` ou `movementDirection` nos dados de ranking.
