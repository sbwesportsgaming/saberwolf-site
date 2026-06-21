# v1.6.60.3 — Navegação interna por área no Organizador

## Objetivo
Separar a Visão Geral das áreas de edição/configuração do painel interno do Organizador.

## Ajustes
- Visão Geral passa a mostrar somente resumo do organizador e ações rápidas.
- Staff deixa de aparecer/editável na Visão Geral.
- Torneios, Temporadas, Rankings, Staff e Configurações passam a abrir como áreas internas dedicadas abaixo do banner.
- A navegação abaixo do banner controla a área ativa.
- Hashes como `#organizerEditorStaff` continuam funcionando.
- Staff ganha mais largura quando aberto na própria área, evitando cards espremidos e conteúdo fora do layout.
- Ações rápidas permanecem na Visão Geral e levam para as áreas corretas.

## Arquivos alterados
- `torneios/editar-organizador.html`
- `js/tournaments/tournament-organizer-admin-page.js`
- `css/tournaments/tournament-organizer-admin.css`

## Banco de dados
Não há SQL novo.
