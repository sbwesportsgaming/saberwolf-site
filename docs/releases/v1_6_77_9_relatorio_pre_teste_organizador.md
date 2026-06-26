# v1.6.77.9 — Relatório pré-teste do organizador externo

## Objetivo

Adicionar um relatório copiável de pré-teste no painel do organizador para facilitar a conferência operacional antes de chamar jogadores reais.

## Contexto

A organização Rinha Online fará um teste real criando e operando a própria organização pela própria conta, enquanto a -SBW- apenas acompanha. Antes de divulgar torneios, o organizador precisa conferir se organização, torneios, janelas, inscrições e check-in estão minimamente preparados.

## O que mudou

- Adicionado botão **Copiar relatório pré-teste** no checklist operacional do organizador externo.
- O relatório inclui:
  - nome da organização;
  - data/hora da geração;
  - status geral do checklist;
  - próximo foco operacional;
  - etapas concluídas/pendentes;
  - resumo dos torneios vinculados;
  - contagem de rascunhos, públicos/agendados, em andamento, finalizados, inscritos e check-ins;
  - lista curta dos torneios carregados;
  - lembretes antes de chamar jogadores reais.
- O relatório pode ser enviado para Discord, WhatsApp ou usado pela equipe da organização como conferência rápida.

## Regras mantidas

- Conta comum continua bloqueada para criar organização ou torneio.
- Organizador externo precisa de permissão antes de operar.
- Team Battle League 4v4 continua com inscrição por equipe em fluxo próprio, não por inscrição individual.
- Nenhuma alteração de banco, RPC ou regra competitiva foi feita neste patch.

## Arquivos alterados

- `js/tournaments/tournament-organizer-admin-page.js`
- `css/tournaments/tournament-organizer-admin.css`
- `docs/releases/v1_6_77_9_relatorio_pre_teste_organizador.md`
