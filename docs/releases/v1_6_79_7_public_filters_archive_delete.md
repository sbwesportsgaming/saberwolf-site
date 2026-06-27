# v1.6.79.7 — Filtros públicos para arquivados/excluídos

## Objetivo

Corrigir o comportamento das páginas públicas após ações administrativas do Admin Master.

Arquivar ou excluir via Admin Master não pode deixar torneios/equipes aparecendo para contas comuns nas páginas públicas.

## Ajustes

- Torneios arquivados, ocultos, privados, removidos ou marcados com `metadata.adminDeleted` deixam de aparecer na página pública de torneios.
- Equipes inativas, privadas, arquivadas ou marcadas com `metadata.adminDeleted` deixam de aparecer na página pública de equipes.
- O detalhe público também deixa de encontrar registros ocultos porque a busca pública passa pela lista filtrada.
- Quando Supabase está ativo, o site não cai mais automaticamente em demo/local apenas por estar rodando em `localhost`.
- Isso evita que equipes demo, como SBW FGC/SaberWolf FGC, reapareçam na página pública após exclusão/remoção do banco real.

## Observação

Este patch não muda as ações do Admin Master e não mexe em SQL. Ele corrige a leitura pública dos dados.

Admin Master deve continuar usando RPCs administrativas para listar/gerenciar todos os registros, inclusive arquivados quando necessário.
