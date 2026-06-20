# v1.6.56.1 — Hotfix Criar Torneio no Organizador

## Objetivo

Corrigir a ausência do botão **Criar Torneio** no perfil/painel do Organizador após a aplicação do visual novo.

## Alterações

- Adiciona botão **Criar Torneio** no hero do perfil público do organizador quando o usuário logado tem permissão naquela organização.
- Mantém o botão oculto para visitantes e usuários sem permissão.
- O botão reaproveita `torneios/create-tournament/criar-torneio.html` com `?organizer=slug`.
- Reforça a validação no painel de edição para reconhecer owner/admin/manager como aptos a criar torneio.
- Melhora o destaque visual do botão de criação.

## Sem alterações

- Não mexe em inscrições.
- Não mexe em rankings.
- Não mexe em convites/equipes.
- Não cria novas tabelas.

## Teste

1. Entrar com usuário owner/admin de uma organização.
2. Abrir o perfil público do organizador.
3. Confirmar que aparece **Criar Torneio**.
4. Clicar e confirmar que abre `criar-torneio.html?organizer=...`.
5. Abrir como visitante/usuário sem permissão e confirmar que o botão não aparece.
