# v1.6.57.1 — Refinamento do perfil do Organizador

## Objetivo
Refinar o perfil público do Organizador para ficar mais fiel ao modelo visual aprovado, com topo mais compacto, ações junto da navegação, ranking visível e cards de torneio mais apresentáveis.

## Alterações
- Otimiza a parte superior do perfil do Organizador para ocupar menos altura útil da tela.
- Move as ações `Ver torneios`, `Criar Torneio` e `Gerenciar organização` para a mesma faixa das abas.
- Mantém `Criar Torneio` e `Gerenciar organização` condicionados à permissão real do usuário.
- Remove a duplicidade visual de “Visão Geral” no primeiro bloco.
- Faz a aba Visão Geral exibir a tabela geral da temporada do organizador.
- Prepara dois rankings visíveis: jogadores e equipes.
- Mantém placeholders quando ainda não houver pontuações cadastradas.
- Move indicadores como temporada atual, participantes, equipes participantes, torneios ativos/finalizados e staff para a parte inferior da Visão Geral.
- Deixa ícones de redes sociais discretos e renderiza somente redes cadastradas pelo organizador.
- Melhora a apresentação dos cards de torneios, com capa, status, jogo, metadados e botão “Ver torneio”.

## Não altera
- RPCs do Supabase.
- RLS.
- Criação de organização.
- Criação de torneio.
- Inscrições.
- Rankings reais/pontuação no banco.

## Testes sugeridos
1. Abrir o perfil público de uma organização.
2. Conferir se o topo ficou mais compacto.
3. Conferir se as ações aparecem na faixa das abas.
4. Testar permissões: visitante não vê ações gerenciais; owner/admin vê.
5. Conferir Visão Geral com ranking de jogadores e equipes.
6. Conferir cards de torneio na aba Torneios.
7. Conferir redes sociais: só devem aparecer as cadastradas.
8. Testar em desktop e mobile.
