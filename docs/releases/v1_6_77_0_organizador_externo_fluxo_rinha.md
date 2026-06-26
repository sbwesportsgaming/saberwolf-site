# v1.6.77.0 — Entrada inteligente do organizador externo

Patch de preparação para testes reais com a organização Rinha Online.

## Objetivo

Garantir que uma conta com permissão de organizador consiga entrar no painel do organizador, criar o próprio perfil organizacional ou abrir a organização já vinculada sem depender de intervenção manual do usuário principal.

## Regras mantidas

- Conta comum não cria organização.
- Conta comum não cria torneio.
- A Rinha Online precisa receber permissão de organizador pela -SBW-.
- Depois da permissão, a organização cria o próprio perfil organizacional.
- Depois do perfil salvo, os torneios são criados vinculados à organização.

## Alterações

- O painel do organizador passa a resolver a entrada automaticamente:
  - se a conta já tiver organização vinculada, abre o painel dessa organização;
  - se a conta tiver permissão, mas ainda não tiver organização, abre o formulário de criação;
  - se a conta não tiver permissão, exibe mensagem clara com os pré-requisitos.
- Adicionado checklist operacional simples para teste real:
  - criar perfil organizacional;
  - criar torneio vinculado;
  - abrir inscrições e check-in;
  - acompanhar inscritos.
- Removida duplicação interna ao salvar organização nova.
- Visual mínimo de apoio para teste, sem refinamento visual profundo.

## Validação recomendada

1. Entrar com conta comum sem permissão no painel do organizador.
2. Confirmar bloqueio claro.
3. Liberar permissão de organizador para a conta da Rinha Online.
4. Entrar em `torneios/editar-organizador.html` sem slug.
5. Confirmar abertura automática do formulário de criação.
6. Salvar o perfil organizacional.
7. Confirmar que o botão de criar torneio fica disponível com vínculo da organização.
8. Criar um torneio vinculado à organização.

## Observação

Este patch não altera o Team Battle League 4v4 e não muda regras de inscrição/check-in dos jogadores.
