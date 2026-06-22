# v1.6.66.1 — Ações rápidas do torneio

## Objetivo

Adicionar um acesso rápido ao organizador na página pública do torneio, ao lado da inscrição, sem alterar Supabase, Auth, RLS, inscrições, check-in, bracket aprovada, resultados públicos ou painel do organizador.

## Ajustes

- Adicionado botão **Ver organizador** para visitantes e usuários comuns.
- Adicionado botão **Gerenciar organização** para usuários com permissão relacionada ao organizador do torneio.
- O botão aparece na área principal de ações do torneio e também no painel da view `view=inscricao`.
- A verificação de permissão usa a lista de acesso retornada por `sbwGetMyTournamentOrganizerAccessAsync()` quando disponível.
- Também há fallback para permissões administrativas globais já carregadas no perfil do usuário.
- O link público usa a rota do organizador quando `window.SBWRoutes.organizer()` estiver disponível.
- O link de gestão aponta para `editar-organizador.html?slug=<organizador>`.

## Segurança

Este patch apenas melhora navegação e rótulos de ação. O acesso real ao painel continua dependendo das validações já existentes no painel do organizador.
