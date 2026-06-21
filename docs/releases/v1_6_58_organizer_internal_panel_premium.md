# v1.6.58 — Painel Interno Premium do Organizador

## Objetivo
Refinar o painel interno do Organizador para seguir o mesmo padrão visual aprovado no perfil público, sem alterar a lógica Supabase/RPC/RLS já validada.

## Arquivos alterados
- `torneios/editar-organizador.html`
- `css/tournaments/tournament-organizer-admin.css`

## Principais ajustes
- Topo do painel mais compacto.
- Prévia/banner do organizador mais próxima do perfil público aprovado.
- Logo, nome e descrição posicionados mais abaixo no banner.
- Navegação interna em faixa arredondada, com `Criar Torneio` destacado dentro do contexto do organizador.
- Cards internos mais leves e menos carregados visualmente.
- Formulário de Configurações mais limpo e alinhado ao padrão premium.
- Mantidos todos os IDs do formulário para preservar salvamento real no Supabase.
- Atualizado cache bust do `tournament-organizer-admin-page.js` para `v=1.6.58`.

## Não altera
- Supabase
- RPCs
- RLS
- criação de organização
- criação de torneio
- página pública aprovada do organizador
