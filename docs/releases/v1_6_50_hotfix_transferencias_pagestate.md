# v1.6.50 hotfix — Transferências sem dependência obrigatória do PageState

Correção rápida para a página de Transferências.

## Ajustes

- Corrige erro quando `window.SBWPageState.showLoading` não existe.
- Corrige erro quando `window.SBWPageState.showError` não existe.
- Mantém carregamento do feed real de transferências sem depender do helper global de estado da página.
- Adiciona fallback visual simples dentro da própria página se houver falha no carregamento.

## Não altera

- SQL da v1.6.50.
- Convites.
- Equipes.
- Remoção de membros.
- RPCs.
