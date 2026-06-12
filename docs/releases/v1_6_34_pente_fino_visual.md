# v1.6.34 — Pente fino visual geral

Patch visual gerado a partir do ZIP atualizado `sbw beta v1.6.33 atual.zip.zip`.

## Objetivo

Padronizar a experiência visual do site sem alterar estrutura, autenticação, Supabase, RLS, convites, torneios ou dados reais.

## Ajustes

- Sidebar única com fonte, peso, altura e espaçamento mais travados entre páginas.
- Páginas com sidebar usando largura útil mais próxima do padrão aprovado na Loja.
- Ajuste de tipografia geral para aproximar títulos, textos e botões do padrão visual da Loja.
- Ritmo de cards, painéis e gaps mais consistente.
- Torneios aproximado do eixo/largura da Loja sem alterar listagem, filtros ou dados.
- Rodapé/direitos reservados centralizado pela tela inteira, sem puxar pela sidebar.

## Arquivos do patch

- `css/core/sbw-visual-balance.css`
- `js/layout/sbw-sidebar.js`
- `docs/releases/v1_6_34_pente_fino_visual.md`

## Observação

O CSS é carregado pelo componente central da sidebar para entrar depois dos CSS específicos de cada página. Isso evita editar cada HTML individualmente e mantém a correção como ajuste visual global.
