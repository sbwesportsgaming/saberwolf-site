# v1.6.44 — Convites reais sem fallback local

## Objetivo

Remover o fallback local da área de convites quando o Supabase está ativo, evitando que convites antigos do navegador apareçam como pendentes e bloqueiem novos convites reais.

## Ajustes

- `Minha Equipe > Convites` passa a listar somente convites reais do Supabase em produção.
- Convites locais antigos são limpos silenciosamente do navegador atual quando a equipe é carregada com Supabase ativo.
- Duplicidade de convite passa a considerar apenas convites reais pendentes.
- Criar convite em produção não salva espelho local.
- Cancelar convite em produção chama apenas a RPC real do Supabase.
- Convites recebidos em `Meu Perfil` também deixam de misturar fallback local com convites reais.

## Observação

Não há SQL novo nesta versão. Ela usa as RPCs já criadas na v1.6.43.
