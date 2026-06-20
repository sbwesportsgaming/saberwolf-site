# v1.6.53 — Organização de Torneios real no Supabase

## Objetivo

Transformar a tela de criação/edição de Organização de Torneios em fluxo real no Supabase, sem localStorage como fonte de verdade.

## Incluído

- Criação real de registro em `public.tournament_organizers`.
- Criação automática do vínculo `owner` em `public.tournament_organizer_members`.
- Edição real de perfil público da organização via RPC.
- Slug público único gerado no Supabase.
- Validação de permissão da v1.6.52 antes de criar organização.
- Botão de salvar do painel passa de “Salvar teste local” para “Salvar organização”.
- `editar-organizador.html?novo=1` agora abre o formulário real de criação.

## RPCs adicionadas

- `public.sbw_can_create_tournament_organization()`
- `public.sbw_can_manage_tournament_organizer(text)`
- `public.sbw_create_tournament_organizer(jsonb)`
- `public.sbw_update_tournament_organizer_profile(text, jsonb)`
- `public.sbw_get_my_tournament_organizers()`

## Segurança

- Usuário comum sem permissão da -SBW- não cria organização.
- Usuário autorizado pela -SBW- pode criar Organização de Torneios.
- O criador vira `owner` somente daquela organização.
- Owner/Admin só edita a própria organização.
- Admin Master/Admin SBW continua tendo acesso administrativo.
- Esta versão não cria convite de staff ainda; isso fica para v1.6.54.

## Fora do escopo

- Convites de equipe da organização.
- Upload direto de banner/logo via Storage.
- Criação de torneio vinculada à organização.
- Temporadas, rankings e pontuação global.
- Migração completa de torneios para produção.

## Teste recomendado

1. Rodar `docs/sql/v1_6_52_organizer_permission_gate.sql` se ainda não foi rodado.
2. Rodar `docs/sql/v1_6_53_tournament_organizers_real.sql`.
3. Conceder permissão de criação de organização pelo Admin Master.
4. Entrar com o usuário autorizado.
5. Abrir `torneios/editar-organizador.html?novo=1`.
6. Criar uma organização com nome, tag, descrição e cores.
7. Confirmar que ela aparece em `tournament_organizers`.
8. Confirmar que o criador virou `owner` em `tournament_organizer_members`.
9. Abrir o perfil público da organização pelo botão “Abrir perfil público”.
10. Editar algum campo e confirmar que salvou no Supabase.
