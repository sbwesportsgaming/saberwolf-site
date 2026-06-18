# v1.6.43 — Transferências e convites de equipe

## Objetivo
Conectar Transferências e Convites ao estado real de equipes/perfis no Supabase, evitando depender de fallback local ou dados demo para fluxos importantes.

## Inclui
- RPC segura para enviar convite de equipe.
- RPC segura para listar convites recebidos pelo usuário logado.
- RPC segura para aceitar convite e criar vínculo real em `team_members`.
- RPC segura para recusar convite.
- Meu Perfil passa a priorizar RPCs reais para convites recebidos.
- Minha Equipe passa a usar RPC para criar convites quando disponível.
- Transferências passa a derivar movimentações reais a partir de `team_members` quando não houver registros oficiais em `transfers`.

## Não inclui
- Sistema completo de janela de transferências.
- Aprovação dupla entre equipe de origem e destino.
- Notificações push.
- Mudanças em Auth, Admin, PWA ou RLS global fora das RPCs.
