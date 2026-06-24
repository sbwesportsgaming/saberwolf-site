# v1.6.73.2 — Showcase público Team Battle League 4v4 no hub de torneios

## Objetivo

Adicionar uma apresentação pública mais clara do formato Team Battle League 4v4 na página de Torneios, sem liberar criação real do formato.

## Alterações

- Criada seção pública de showcase do Team Battle League 4v4 no hub de Torneios.
- Explicada a separação entre:
  - Team Battle League 4v4 básica = divisão única;
  - Team Battle League 4v4 avançada = várias divisões.
- Adicionado resumo visual de elenco, pontuação e fluxo competitivo.
- Mantido o formato como roadmap/em preparação.

## Arquivos alterados

- `torneios/torneios.html`
- `css/torneios.css`

## Validação sugerida

- Abrir `/torneios/torneios.html`.
- Conferir se a nova seção aparece após os cards de formatos.
- Validar responsividade em desktop/mobile.
- Conferir Console do navegador; `favicon.ico 404` não bloqueia o teste.

## Observação

Não altera Supabase, Auth, RLS, inscrições, check-in, bracket, resultados, Ranking Global ou Admin Master.
