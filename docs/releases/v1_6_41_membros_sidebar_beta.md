# v1.6.41 — Membros da equipe + selo Beta no menu

## Objetivo

Refinar a aba **Membros** da página **Minha Equipe** e deixar claro no menu lateral que áreas ainda estão em fase beta pública.

## Alterações

- Adicionado selo **Beta** no menu lateral para:
  - Perfis
  - Equipes
  - Torneios
  - Rankings
  - Transferências
- Mantida a sidebar global sem alteração estrutural.
- Melhorada a aba **Membros** da Minha Equipe:
  - resumo com membros ativos, capitão, gestão e vagas;
  - lista com visual mais premium;
  - destaque visual para capitão;
  - destaque visual para o usuário logado quando ele aparece na lista;
  - suporte visual para avatar de membro quando existir.

## Não alterado

- Supabase/RLS.
- Permissões.
- Upload de imagens.
- Sidebar estrutural.
- Equipe demo.
- Regras de convites/remoção.

## Testes sugeridos

- Abrir `/equipes/minha-equipe.html?v=1641`.
- Conferir a aba **Membros**.
- Conferir se o capitão/usuário logado recebe destaque.
- Conferir se as demais abas continuam carregando.
- Conferir o menu lateral em páginas públicas e confirmar selo **Beta** somente nos itens definidos.
