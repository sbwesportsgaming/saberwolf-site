# v1.6.57 — Organizador Visual Premium

Refinamento visual dedicado para aproximar o Perfil/Painel do Organizador do modelo aprovado pela -SBW-.

## Arquivos alterados

- `torneios/organizador.html`
- `torneios/editar-organizador.html`
- `css/organizers/organizer-profile.css`
- `css/tournaments/tournament-organizer-admin.css`
- `js/tournaments/tournament-organizer-page.js`

## O que mudou

- Recria o visual do perfil público do organizador em estilo dark premium com hero grande, banner, logo circular, métricas, abas e cards.
- Recria o painel interno do organizador com sidebar atual da -SBW-, topbar, hero de prévia, abas internas e cards de gestão.
- Mantém os IDs existentes do formulário para não quebrar criação/edição de organização no Supabase.
- Mantém o botão `Criar Torneio` controlado por permissão real.
- Corrige o favicon/caminho de logo antigo de `.jpg` para `logo-sbw.png` no painel do organizador.
- Não altera RPCs, RLS, Supabase, criação de torneio, inscrições, rankings ou temporadas.

## Observações

A versão busca máxima fidelidade visual ao modelo aprovado, sem transformar dados de placeholder em números reais. Métricas futuras como jogadores únicos, partidas e ranking serão conectadas nas fases próprias.
