# v1.6.51 — Meu Perfil abre Convites por link direto

## Objetivo
Corrigir o comportamento em que o usuário clicava em **Convites** e a página **Meu Perfil** abria na área padrão/dados pessoais, em vez de abrir diretamente a aba de convites recebidos.

## Alterações
- `perfis/meu-perfil.html#convites` agora abre a aba **Convites** automaticamente.
- Suporte também a aliases como `#invites`, `#convites-recebidos`, `?tab=convites` e `?aba=convites`.
- Ao clicar nas abas internas, a URL passa a refletir a seção atual.
- Não altera Supabase, RPCs, convites, equipes, Transferências ou RLS.

## Teste recomendado
1. Acessar `/perfis/meu-perfil.html#convites` logado.
2. Confirmar que a aba **Convites** abre direto.
3. Clicar em **Dados públicos**, **Minha equipe** e voltar em **Convites**.
4. Confirmar que o link de Convites vindo do menu lateral/dropdown também cai na aba correta.
