# v1.6.76.13 — Estabilização estrutural para testes reais do Team Battle League 4v4

## Objetivo

Fechar a parte estrutural do Team Battle League 4v4 antes dos testes reais do fim de semana, sem refinamento visual profundo, mas mantendo a experiência decente e segura para equipes e pessoas reais.

## Ajustes principais

- Atualiza a leitura do formato para **beta controlado** em vez de textos antigos de preparação/bloqueio.
- Corrige defaults técnicos do setup 4v4: `rosterSize` e reserva por confronto passam a usar os campos corretos da configuração base.
- Mantém o modo básico limitado à **Divisão Única**.
- Mantém capacidade por equipes e regra de números pares no limite do torneio.
- Mantém suporte a quantidade real ímpar de equipes confirmadas por folga técnica, sem criar equipe fake/demo.
- Mantém agenda livre por confronto sob controle do organizador.
- Mantém resultados, classificação operacional, Playoffs -SBW-, fechamento oficial e auditoria como blocos preparados para teste.
- Adiciona checklist de teste real controlado no painel do organizador.
- Atualiza textos técnicos antigos que ainda falavam em teste interno ou criação bloqueada.

## Regras preservadas

- Nome do formato permanece **Team Battle League 4v4**.
- Fase final aparece como **Playoffs -SBW-**.
- Não usar nomes externos nas páginas públicas de torneio.
- Não usar equipes demo, fake ou placeholders como participantes reais.
- Modo avançado com várias divisões continua reservado para fase futura.

## Foco dos testes reais

Testar com equipes reais:

1. Criação do torneio no formato Team Battle League 4v4.
2. Capacidade por equipes.
3. Página pública antes do check-in.
4. Entrada de equipes reais após check-in.
5. Folga técnica quando houver número ímpar.
6. Agenda por confronto.
7. Status operacional.
8. Resultados da fase classificatória.
9. Classificação.
10. Liberação e resultados dos Playoffs -SBW-.
11. Fechamento oficial com campeão/pódio.
12. Auditoria operacional no painel do organizador.
