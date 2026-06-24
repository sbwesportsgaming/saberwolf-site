# v1.6.73.3 — Fluxo visual e checklist Team Battle League 4v4

## Objetivo

Consolidar a prévia visual do Team Battle League 4v4 com um mapa mais claro de confronto, etapas públicas e checklist administrativo de liberação.

## Alterações

- Adicionado mapa visual do confronto 4v4 na página pública do torneio.
- Adicionadas etapas públicas explicando o fluxo básico do formato.
- Adicionado bloco operacional no painel do organizador para a futura liberação do formato.
- Adicionado checklist visual reforçando que o formato continua em preparação.
- Mantida a regra:
  - Team Battle League 4v4 básica = divisão única.
  - Team Battle League 4v4 avançada = várias divisões.

## Segurança

- Não libera criação real do formato.
- Não altera Supabase, Auth, RLS ou dados reais.
- Não altera inscrições, check-in, resultados reais, bracket ou Ranking Global.

## Testes sugeridos

- `torneios/detalhe-torneio.html?id=<id-ou-slug>&view=visao-geral`
- `torneios/create-tournament/criar-torneio.html`
- `torneios/editar-organizador.html?slug=<slug-do-organizador>`

Se o Console mostrar apenas `favicon.ico 404`, está ok.
