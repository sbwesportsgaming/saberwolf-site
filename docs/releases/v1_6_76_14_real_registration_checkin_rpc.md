# v1.6.76.14 — Inscrição e check-in reais protegidos por RPC

## Objetivo

Preparar a plataforma -SBW- para testes reais com organizador externo e jogadores reais, reduzindo o risco de manipulação de inscrição/check-in pelo Console ou API direta.

Este patch consolida a vistoria feita sobre a proposta do Codex: aproveita a ideia de inscrição/check-in por RPC, mas corrige os pontos de risco encontrados antes da aplicação.

## Regra operacional preservada

Conta comum continua sem poder criar organização ou torneio sem permissão de organizador.

Fluxo correto para Rinha Online:

1. conta da Rinha recebe permissão de organizador;
2. Rinha acessa o painel pela própria conta;
3. Rinha cria/configura seu perfil organizacional;
4. Rinha cria torneios vinculados à organização;
5. jogadores reais se inscrevem e fazem check-in pela página pública.

## Regra preservada do Team Battle League 4v4

O Team Battle League 4v4 não aceita inscrição individual comum.

Regra correta:

1. inscrição deve ser por equipe;
2. a equipe precisa ser real na plataforma -SBW-;
3. o responsável/capitão/gestor autorizado inscreve a equipe;
4. os 4 jogadores selecionados precisam ser membros da mesma equipe;
5. não pode misturar jogadores de equipes diferentes;
6. não pode usar jogador sem equipe/free agent;
7. a etapa própria de inscrição por equipe será feita separadamente.

A RPC pública `sbw_register_tournament_participant` bloqueia inscrição individual nesse formato.

## O que mudou

- Criada RPC `sbw_register_tournament_participant` para inscrição pública real.
- Criada RPC `sbw_check_in_tournament_participant` para check-in público real.
- Front deixa de usar `.insert()` direto em `tournament_participants` para inscrição pública.
- Botão público de check-in deixa de exibir alerta placeholder e passa a chamar a RPC real.
- Adicionado `checked_in_at` em `tournament_participants`.
- Garantidas as colunas de janela em `tournaments`:
  - `registration_opens_at`;
  - `registration_closes_at`;
  - `checkin_starts_at`;
  - `checkin_ends_at`.
- Criação/edição de torneio passa a aceitar janelas de:
  - abertura de inscrição;
  - fechamento de inscrição;
  - abertura do check-in;
  - fechamento do check-in.
- A RPC também consegue ler janelas antigas salvas em `settings`/`metadata`, quando existirem.
- `profile_id` é tratado como texto para compatibilidade com o modelo atual da plataforma.
- Fallback demo de torneios/organizadores fica bloqueado em produção quando Supabase está ativo e vazio.
- Insert/update/delete direto em `tournament_participants` é revogado de `authenticated`; jogador deve usar RPC.
- A página pública mostra aviso correto quando o torneio é Team Battle League 4v4: inscrição por equipe, não individual.

## Arquivos principais

- `docs/sql/v1_6_76_14_real_registration_checkin_rpc.sql`
- `js/tournaments/tournaments-storage.js`
- `js/tournaments/tournament-detail-page.js`
- `js/tournaments/tournament-admin-page.js`
- `js/tournaments/tournament-organizer-admin-page.js`
- `torneios/create-tournament/criar-torneio.html`
- `torneios/detalhe-torneio.html`
- `torneios/editar-organizador.html`

## Validação manual recomendada

1. Rodar o SQL no Supabase SQL Editor.
2. Criar/editar torneio comum com janelas de inscrição e check-in.
3. Usuário sem login tenta se inscrever: deve ser enviado para login.
4. Usuário logado se inscreve: deve salvar inscrição real via RPC.
5. Usuário tenta inscrição duplicada: deve ser bloqueado/avisado.
6. Torneio fora da janela de inscrição: deve bloquear inscrição.
7. Torneio cheio deve bloquear ou enviar para waitlist conforme configuração.
8. Jogador inscrito faz check-in dentro da janela: deve gravar `check_in_status = checked_in` e `checked_in_at`.
9. Jogador não inscrito tenta check-in: deve ser bloqueado.
10. Check-in fora da janela: deve ser bloqueado.
11. Organizador deve ver inscritos e confirmados no painel.
12. Torneio Team Battle League 4v4 deve bloquear inscrição individual e orientar inscrição por equipe.

## Observação

Este patch não cria ainda a inscrição por equipe do Team Battle League 4v4. Ele apenas impede o caminho errado de inscrição individual e prepara os torneios comuns para teste real seguro.
