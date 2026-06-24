# v1.6.71.6 — Trava técnica de formatos em preparação

Este patch reforça a segurança da base de formatos avançados da plataforma -SBW-.

## Ajustes

- Adiciona helpers no catálogo central de formatos para validar se um formato pode ser usado em criação real.
- Bloqueia, por validação defensiva, formatos com status `planned` na criação de torneios.
- Bloqueia formatos em preparação no editor do organizador antes de salvar alterações.
- Exibe aviso visual quando um formato planejado aparece no preview do editor.
- Mantém o Team Battle League 4v4 como roadmap, sem liberar estrutura incompleta.

## Observação

O objetivo é impedir que um formato futuro seja ativado por engano ou por manipulação do HTML antes da implementação completa.
