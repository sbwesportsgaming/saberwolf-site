# v1.6.77 — Checklist final antes dos testes reais

Este documento consolida a preparação da plataforma -SBW- para testes reais com a organização Rinha Online, jogadores reais e torneios reais.

## Objetivo

Validar se a plataforma -SBW- está pronta para um teste real controlado, com foco em:

- conta de organizador externo com permissão correta;
- criação do perfil organizacional pela própria organização;
- criação e gestão de torneios vinculados à organização;
- inscrição pública protegida por RPC;
- check-in público protegido por RPC;
- acompanhamento de inscritos pelo organizador;
- comunicação clara para jogadores;
- estados vazios e erros amigáveis;
- Team Battle League 4v4 mantido estável em Beta controlado.

## Pré-requisitos antes do teste

### Admin Master

- [ ] Confirmar que a conta da Rinha Online existe na plataforma.
- [ ] Confirmar que a conta da Rinha Online recebeu permissão de organizador.
- [ ] Confirmar que conta comum continua sem poder criar organização ou torneio.
- [ ] Confirmar no Admin Master o pré-check de organizador externo.
- [ ] Confirmar que a Rinha entende que criará a própria organização pela própria conta.

### Banco/Supabase

- [ ] Confirmar que o SQL da v1.6.76.14 foi aplicado.
- [ ] Confirmar que existem as RPCs:
  - `sbw_register_tournament_participant`;
  - `sbw_check_in_tournament_participant`;
  - `sbw_recount_tournament_participants`.
- [ ] Confirmar que inscrição e check-in públicos não dependem mais de insert/update direto no front.

### Git/Publicação

- [ ] Confirmar `git status --short` limpo antes do teste.
- [ ] Confirmar push na branch `main`.
- [ ] Confirmar publicação no GitHub Pages.
- [ ] Abrir o site em aba anônima para evitar cache antigo.
- [ ] Se necessário, usar atualização forçada no navegador/PWA.

## Fluxo 1 — Rinha Online como organizador externo

### Entrada no painel

- [ ] Rinha faz login com a própria conta.
- [ ] Acessa o painel do organizador.
- [ ] Se ainda não tiver organização, o sistema orienta a criar o perfil organizacional.
- [ ] Se já tiver organização, o painel abre a organização vinculada.
- [ ] Se faltar permissão, o sistema mostra mensagem clara.

### Criação/edição da organização

- [ ] Criar perfil organizacional.
- [ ] Editar nome público.
- [ ] Editar descrição.
- [ ] Adicionar links/dados básicos se aplicável.
- [ ] Salvar.
- [ ] Confirmar que a organização aparece no painel.
- [ ] Confirmar que a página pública da organização abre corretamente.

### Checklist operacional

- [ ] Conferir checklist do painel.
- [ ] Copiar relatório pré-teste.
- [ ] Verificar próximo foco operacional indicado pelo sistema.

## Fluxo 2 — Criação de torneio comum

Testar pelo menos um torneio comum antes de qualquer teste mais complexo.

- [ ] Criar torneio vinculado à organização.
- [ ] Selecionar jogo.
- [ ] Selecionar formato comum, preferencialmente Double Elimination para primeiro teste.
- [ ] Definir limite par de participantes.
- [ ] Configurar data/horário de referência.
- [ ] Configurar abertura/fechamento das inscrições.
- [ ] Configurar abertura/fechamento do check-in.
- [ ] Salvar como rascunho.
- [ ] Conferir pré-validação.
- [ ] Corrigir pendências indicadas.
- [ ] Publicar/abrir inscrições quando estiver pronto.

## Fluxo 3 — Inscrição pública de jogador

### Sem login

- [ ] Abrir página pública do torneio sem login.
- [ ] Tentar inscrição.
- [ ] Confirmar mensagem pedindo login.

### Com login

- [ ] Jogador faz login.
- [ ] Entra na página pública do torneio.
- [ ] Confere status operacional público.
- [ ] Confere orientações para jogadores.
- [ ] Faz inscrição.
- [ ] Confirma que a inscrição aparece como realizada.
- [ ] Tenta se inscrever novamente.
- [ ] Confirmar bloqueio de duplicidade.

## Fluxo 4 — Check-in público

- [ ] Antes da janela, confirmar mensagem de check-in ainda não aberto.
- [ ] Durante a janela, jogador inscrito faz check-in.
- [ ] Confirmar mensagem de sucesso.
- [ ] Confirmar que não permite check-in duplicado.
- [ ] Confirmar que jogador não inscrito não consegue fazer check-in.
- [ ] Depois da janela, confirmar bloqueio por janela encerrada.

## Fluxo 5 — Gestão do organizador

- [ ] Organizador abre painel do torneio.
- [ ] Confere lista de inscritos.
- [ ] Usa filtros:
  - ativos;
  - pendentes de check-in;
  - check-in feito;
  - lista de espera;
  - removidos;
  - todos.
- [ ] Usa botão Atualizar.
- [ ] Usa Copiar chamada.
- [ ] Confere contadores de inscritos e check-ins.
- [ ] Confere se estados vazios são claros quando ainda não há dados.

## Fluxo 6 — Divulgação

- [ ] Na lista de torneios vinculados, usar Copiar chamada.
- [ ] Conferir texto gerado.
- [ ] Confirmar que o link público está correto.
- [ ] Enviar chamada em ambiente de teste controlado.

## Fluxo 7 — Team Battle League 4v4

O Team Battle League 4v4 está em Beta controlado. Não deve ser testado como inscrição individual comum.

Validar apenas:

- [ ] Nome público permanece Team Battle League 4v4.
- [ ] A página pública informa inscrição por equipe quando aplicável.
- [ ] Inscrição individual fica bloqueada.
- [ ] Não aparecem nomes externos como SFL, Capcom ou Street Fighter League.
- [ ] Não aparecem equipes fake/demo.
- [ ] Playoffs aparecem com nomenclatura própria da plataforma -SBW-.

## Console do navegador

Durante os testes, abrir F12 > Console.

Ignorar apenas:

```txt
favicon.ico 404
```

Registrar qualquer outro erro com:

- página;
- ação realizada;
- print ou texto do erro;
- conta utilizada;
- horário aproximado.

## Critérios de aprovação

O teste pode ser considerado aprovado se:

- [ ] Rinha Online consegue acessar o painel como organizador externo.
- [ ] Rinha cria ou edita a própria organização.
- [ ] Rinha cria torneio vinculado à organização.
- [ ] Torneio pode ser publicado com janelas configuradas.
- [ ] Jogador logado consegue se inscrever.
- [ ] Duplicidade de inscrição é bloqueada.
- [ ] Check-in funciona pela janela correta.
- [ ] Organizador enxerga inscritos e confirmados.
- [ ] Não há erro crítico no Console.
- [ ] Usuário comum continua bloqueado para criar organização/torneio.

## Critérios de reprovação crítica

Corrigir antes de ampliar testes se ocorrer:

- conta comum criando organização ou torneio;
- jogador manipulando inscrição/check-in fora das RPCs;
- inscrição duplicada aceita;
- check-in de não inscrito aceito;
- torneio criado sem vínculo com organização correta;
- página pública quebrando com erro de JavaScript;
- organizador vendo ou editando torneio de outra organização.

## Pós-teste

Depois do teste, registrar:

- o que funcionou bem;
- onde a Rinha Online se perdeu;
- onde jogadores tiveram dúvidas;
- quais mensagens precisam melhorar;
- quais bugs precisam correção imediata;
- quais melhorias podem ficar para depois.
