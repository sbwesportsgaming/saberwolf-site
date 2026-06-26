# v1.6.78 — Validação dos modos normais de torneio

Este documento orienta o teste real dos modos comuns da plataforma -SBW- sem reabrir a estrutura do Team Battle League 4v4.

## Objetivo

Validar se jogadores reais conseguem se inscrever, fazer check-in e acompanhar torneios criados por uma organização externa, especialmente a Rinha Online, nos formatos tradicionais da plataforma.

Modos priorizados:

- Double Elimination;
- Grupos + Playoffs;
- Pontos Corridos.

O Team Battle League 4v4 deve ser validado apenas de forma mínima nesta rodada, pois sua inscrição por equipe terá fluxo próprio.

---

## Pré-requisitos antes do teste

### Admin Master

- Confirmar que a conta da organização externa possui permissão de organizador.
- Confirmar que conta comum continua sem permissão para criar organização ou torneio.
- Confirmar que o SQL da v1.6.76.14 foi aplicado no Supabase.
- Confirmar que as RPCs de inscrição e check-in existem:
  - `sbw_register_tournament_participant`;
  - `sbw_check_in_tournament_participant`.

### Organização externa

- Criar ou acessar perfil organizacional próprio.
- Criar pelo menos um torneio comum.
- Configurar janelas reais:
  - abertura da inscrição;
  - fechamento da inscrição;
  - abertura do check-in;
  - fechamento do check-in.
- Publicar/abrir inscrições somente depois que o checklist do painel indicar que o torneio está pronto.

---

## Teste 1 — Double Elimination

### Criação

- Criar torneio no formato Double Elimination.
- Informar nome, jogo, data, limite de participantes, descrição, regras básicas e janelas de inscrição/check-in.
- Salvar como rascunho.
- Conferir pré-validação no painel.
- Publicar/abrir inscrições.

### Inscrição

Validar com jogadores reais:

- jogador sem login recebe orientação para entrar;
- jogador logado consegue se inscrever;
- tentativa duplicada é bloqueada;
- inscrição fora da janela é bloqueada;
- torneio lotado bloqueia inscrição ou encaminha para lista de espera, se aplicável.

### Check-in

- jogador inscrito consegue fazer check-in dentro da janela;
- jogador não inscrito não consegue fazer check-in;
- check-in fora da janela é bloqueado;
- check-in duplicado não cria nova inscrição;
- organizador consegue ver inscritos e check-ins no painel.

### Estrutura

- Confirmar que a chave usa participantes reais.
- Confirmar que participantes sem check-in não entram quando o modo exigir confirmação.
- Confirmar que bye/folga técnica não aparece como jogador fake.

---

## Teste 2 — Grupos + Playoffs

### Criação

- Criar torneio no formato Grupos + Playoffs.
- Configurar janelas e limite par de participantes.
- Publicar somente quando a pré-validação estiver OK.

### Inscrição e check-in

Repetir os mesmos testes do Double Elimination:

- login;
- inscrição real;
- duplicidade;
- janela de inscrição;
- check-in;
- lista de confirmados.

### Grupos

- Confirmar que os grupos são montados apenas com participantes reais/confirmados.
- Confirmar que grupos vazios não mostram jogadores demo.
- Confirmar que a página pública explica quando ainda está aguardando check-in ou geração dos grupos.

### Playoffs

- Confirmar se os classificados dos grupos aparecem corretamente na fase final.
- Confirmar que resultados de grupo alimentam classificação antes da fase final.

---

## Teste 3 — Pontos Corridos

### Criação

- Criar torneio no formato Pontos Corridos.
- Configurar janelas de inscrição/check-in.
- Publicar somente depois que a pré-validação indicar que está pronto.

### Inscrição e check-in

- Validar inscrição real por RPC.
- Validar check-in real por RPC.
- Confirmar que organizador vê inscritos e check-ins.

### Rodadas e tabela

- Confirmar que rodadas usam participantes reais.
- Confirmar que número ímpar usa folga técnica sem jogador fake.
- Confirmar que a tabela não pontua folga.
- Confirmar que resultados lançados atualizam a classificação.

---

## Teste mínimo — Team Battle League 4v4

Nesta etapa, não testar inscrição individual no Team Battle.

Validar apenas:

- o nome público permanece Team Battle League 4v4;
- a página informa que a inscrição será por equipe;
- inscrição individual comum é bloqueada;
- não aparece SFL, Capcom ou Street Fighter League nas telas públicas;
- não aparece equipe demo/fake.

Regra correta:

- equipe inscrita precisa ser equipe real da plataforma;
- os 4 jogadores devem pertencer à mesma equipe;
- 3 titulares + 1 reserva;
- fluxo próprio de inscrição por equipe será tratado em patch futuro.

---

## Checklist de aprovação do teste

O teste pode ser considerado aprovado se:

- a organização externa cria e opera torneio próprio sem intervenção manual do dono da plataforma;
- jogadores reais conseguem se inscrever em torneio comum;
- jogadores reais conseguem fazer check-in;
- duplicidade de inscrição é bloqueada;
- inscrição/check-in fora da janela é bloqueada;
- organizador vê inscritos e confirmados;
- páginas públicas não exibem dados demo como se fossem reais;
- Console não mostra erro crítico, exceto `favicon.ico 404`.

---

## Registro de problemas

Para cada problema encontrado, registrar:

```txt
Modo:
Página:
Conta usada:
Passo executado:
Resultado esperado:
Resultado obtido:
Erro no Console:
Print ou vídeo:
Gravidade: crítica / alta / média / baixa
```

## Prioridade depois do teste

1. Corrigir bloqueios de inscrição/check-in real.
2. Corrigir erros que impedem a organização externa de operar.
3. Corrigir problemas na geração de chave/grupos/tabela.
4. Melhorar mensagens públicas confusas.
5. Só depois refinar visual.
