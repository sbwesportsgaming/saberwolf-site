# v1.6.76.1 — Ajuste de capacidade por equipes no Team Battle League 4v4

## Objetivo

Refinar a tela de criação/edição de torneios para que o formato **Team Battle League 4v4** trate a capacidade como **equipes**, não como participantes individuais.

## Alterações

- Ao selecionar `Team Battle League 4v4`, o campo de capacidade passa a exibir **Limite de equipes**.
- O campo usa sempre numeração par (`step=2`).
- Valores ímpares são normalizados automaticamente para o próximo número par.
- A validação exige capacidade entre 2 e 256 em número par.
- Para formatos comuns, o texto continua como **Limite de participantes**, mas a capacidade também segue número par.
- O sistema mantém compatibilidade com `max_participants`, mas salva metadados extras indicando unidade de capacidade:
  - `capacityUnit: "teams"` no Team Battle 4v4;
  - `capacityUnit: "participants"` nos demais formatos.
- Ao salvar Team Battle League 4v4 pelo painel do organizador, os metadados básicos do modo 4v4 também são preservados.

## Regra operacional

Mesmo que no final o torneio tenha quantidade real ímpar de equipes/inscritos confirmados, a capacidade planejada fica em número par. A estrutura/bracket continua responsável por aplicar bye/encaixe conforme planejado.
