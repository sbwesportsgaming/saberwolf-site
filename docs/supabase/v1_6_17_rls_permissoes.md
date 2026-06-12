# v1.6.17 — Mapa de Supabase/RLS e permissões sensíveis

Este documento acompanha o patch estrutural v1.6.17. Ele não muda schema nem aplica SQL automaticamente.

## Objetivo

Mapear quais ações do site precisam ser protegidas pelo Supabase/RLS, além de estarem escondidas ou exibidas no front-end.

Regra-base:

```txt
Front-end mostra ou esconde botões.
Supabase/RLS bloqueia ações indevidas de verdade.
```

## Tabelas principais

- `profiles`
- `teams`
- `team_members`
- `team_invites`
- `organizer_permissions`
- `site_permissions`

## Ações sensíveis que precisam de policy/função segura

### Profiles

- Usuário autenticado pode ler perfis públicos.
- Usuário autenticado pode editar apenas o próprio perfil.
- Admin Master/Admin SBW pode moderar perfis.
- Permissões altas não devem ser concedidas por usuário comum.

### Teams

- Usuário logado pode criar 1 equipe principal se ainda não tiver equipe ativa.
- Dono/capitão/manager pode editar a própria equipe.
- Admin Master/Admin SBW pode verificar, remover verificação e moderar equipe.
- Equipe comum não cria subequipe.
- Equipe verificada pode criar subequipe.

### Team members

- Usuário não deve entrar diretamente em equipe sem convite aceito ou ação administrativa.
- Usuário pode participar de apenas 1 equipe ativa.
- Dono/capitão/manager pode gerenciar membros da própria equipe.
- Admin Master/Admin SBW pode moderar vínculos.

### Team invites

- Dono/capitão/manager pode convidar jogador para sua equipe.
- Jogador convidado pode aceitar ou recusar o próprio convite.
- Não deve aceitar convite se já estiver em equipe ativa.
- Convites duplicados pendentes devem ser bloqueados.

### Organizer permissions

- Apenas Admin Master/Admin SBW deve aprovar organizador.
- Organizador aprovado pode criar torneio conforme as regras do sistema.
- Permissões de organizador não devem depender de localStorage.

### Site permissions

- Apenas Master Admin deve conceder/remover permissões altas.
- Nenhum usuário pode conceder permissão igual ou superior à sua própria.
- A conta principal do projeto deve ser a única com permissão máxima.

## Diagnóstico no painel Admin

O patch v1.6.17 adiciona no Admin Master a aba:

```txt
RLS / Segurança
```

Ela executa leituras seguras nas tabelas principais para ajudar a identificar:

- tabela ausente;
- tabela não exposta;
- leitura bloqueada por RLS;
- contexto SBW sem roles;
- sessão Auth ausente.

O diagnóstico não altera dados.

## Próxima etapa

A próxima fase deve transformar esse mapa em policies/RPCs reais no Supabase, depois de validar quais tabelas e colunas estão definitivas no projeto.
