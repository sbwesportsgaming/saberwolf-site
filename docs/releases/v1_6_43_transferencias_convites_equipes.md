# v1.6.43 — Transferências + Convites de Equipe

## Objetivo
Conectar a área de Transferências e Convites ao fluxo real de equipes, reduzindo dependência de fallback local em produção.

## Incluído
- Envio de convite de equipe via RPC no Supabase.
- Listagem de convites recebidos no Meu Perfil via RPC.
- Aceitar convite criando vínculo real em `team_members`.
- Recusar convite atualizando status real.
- Listagem de convites enviados no painel Minha Equipe via RPC segura.
- Cancelamento de convite enviado antes do usuário aceitar.
- Transferências derivando movimentações reais de `team_members` quando não houver tabela oficial de transferências preenchida.

## Observações
- Fallback local continua útil apenas para desenvolvimento local/VS Code.
- Em produção, se Supabase estiver ativo e o convite real falhar, o sistema não deve fingir que salvou localmente como verdade.
- Este patch não altera PWA, Auth, Admin ou visual profundo.
