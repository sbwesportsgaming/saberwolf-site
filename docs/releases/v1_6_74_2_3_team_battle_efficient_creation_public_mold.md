# v1.6.74.2/74.3 — Criação eficiente e molde público Team Battle League 4v4

## Objetivo

Consolidar em um único patch o fluxo correto do MVP básico do Team Battle League 4v4, evitando rascunhos com equipes fictícias e mantendo o processo eficiente.

## Regra do fluxo

- Na criação do torneio, exibir apenas a configuração visual do formato.
- Depois de criado, a página pública do torneio mostra o molde da Divisão Única vazio.
- Após o check-in, somente equipes reais confirmadas devem aparecer no grupo/tabela.
- Não usar Equipe 1, Equipe 2, Equipe A/B ou elencos demo como participantes visuais do torneio.

## Alterações

- Ajusta a prévia do Team Battle League 4v4 na criação do torneio para focar em configuração e regras.
- Adiciona fluxo visual eficiente: criar torneio, mostrar molde, preencher após check-in, gerar confrontos/resultados na etapa funcional.
- Ajusta o helper de prévia visual para não criar equipes padrão/fictícias quando não houver equipes reais.
- Adiciona molde público da Divisão Única na página do torneio.
- Mostra tabela vazia com mensagem clara: equipes reais aparecem após check-in.
- Remove fallback visual com equipes fictícias nas prévias administrativas/públicas.

## Fora do escopo

- Não libera criação real do Team Battle League 4v4.
- Não cria inscrições reais de equipe.
- Não gera confrontos reais ainda.
- Não salva resultados reais.
- Não altera Supabase, Auth, RLS, Ranking Global ou Admin Master.
