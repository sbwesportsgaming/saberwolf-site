# v1.6.39 — Minha Equipe: reorganização revisada

Patch revisado da área Minha Equipe.

## Ajustes

- Mantém a navegação em lista simples, sem quadradinhos grandes.
- Move o banner da equipe para uma faixa ampla acima da navegação interna.
- Cria uma faixa de identidade abaixo do banner com logo, nome, selo e ações.
- Remove o card duplicado de identidade/seleção de equipe da lateral.
- Mantém botões visuais "Editar banner" e "Editar logo" como preparação para upload futuro, sem implementar Storage/crop ainda.
- Remove campos visíveis de URL de logo/banner da aba Perfil público, preservando os valores internamente para não apagar dados salvos.
- Mantém edição de cores na aba Perfil público e documenta que cores automáticas por imagem ficam para etapa futura.
- Troca lista aberta de jogos por busca e seletor recolhível em ordem alfabética.

## Não altera

- Supabase/RLS.
- Sidebar global.
- Permissões.
- Upload real de imagem.
- Equipe demo.
