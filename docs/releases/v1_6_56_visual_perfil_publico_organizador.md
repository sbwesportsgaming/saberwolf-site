# v1.6.56 — Visual novo do perfil público do Organizador

Esta versão refaz o visual da página pública individual do Organizador de Torneios, usando a referência aprovada de painel dark premium.

## Alterações

- Refatorada `torneios/organizador.html` para usar a sidebar padrão atual da -SBW-.
- Criado `css/organizers/organizer-profile.css` com visual premium para hero, banner, logo, stats, abas e cards.
- Atualizado `js/tournaments/tournament-organizer-page.js` para renderizar a página pública com abas:
  - Visão Geral
  - Torneios
  - Temporadas
  - Rankings
  - Histórico
- A aba Torneios mostra somente torneios daquele organizador.
- Rankings, Temporadas e Histórico usam estados vazios limpos quando ainda não houver dados reais suficientes.
- O botão “Gerenciar organizador” aparece apenas quando a conta logada tem vínculo/permissão naquele organizador.
- Inscrições continuam fora do perfil do organizador e permanecem dentro da página de cada torneio.

## Não alterado

- Sem mudanças em Supabase/RLS.
- Sem mudanças em convites, equipes, transferências ou inscrições.
- Sem mudanças no fluxo real de criação de torneio da v1.6.55.

## Testes sugeridos

1. Abrir `organizadores/organizadores.html`.
2. Clicar em “Ver perfil” de uma organização.
3. Confirmar o novo visual do hero/banner/logo.
4. Conferir abas públicas.
5. Confirmar que usuário comum não vê “Gerenciar organizador”.
6. Confirmar que usuário com permissão vê “Gerenciar organizador”.
7. Abrir a aba Torneios e conferir se só mostra torneios daquele organizador.
