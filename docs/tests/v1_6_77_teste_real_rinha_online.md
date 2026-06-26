# Roteiro de teste real — Rinha Online e torneios da plataforma -SBW-

Versão de referência: **v1.6.77.x**  
Objetivo: validar o fluxo real de organizador externo, jogadores reais, inscrições, check-in e operação básica de torneios antes de avançar para novas features.

---

## 1. Premissas obrigatórias antes do teste

Antes de chamar jogadores reais, confirmar:

- A conta da Rinha Online existe na plataforma -SBW-.
- A conta da Rinha Online recebeu permissão de organizador pela -SBW-.
- Conta comum continua sem poder criar organização ou torneio.
- A Rinha Online consegue acessar o painel do organizador com a própria conta.
- O SQL da v1.6.76.14 foi aplicado no Supabase.
- Inscrição e check-in público estão usando RPC.
- O repositório está limpo após aplicar os patches.
- Se aparecer apenas `favicon.ico 404` no Console, isso não bloqueia o teste.

---

## 2. Fluxo Admin Master — liberação da Rinha Online

### Objetivo
Garantir que a conta parceira esteja apta a criar e operar sua própria organização.

### Passos

1. Entrar como Admin Master.
2. Abrir a área de organizadores/permissões.
3. Confirmar se a conta da Rinha Online aparece como usuário da plataforma.
4. Conceder permissão de organizador, se ainda não estiver ativa.
5. Usar o pré-check do Admin Master para confirmar a liberação.
6. Copiar o checklist Admin, se necessário, para registro interno.

### Resultado esperado

- A Rinha Online deve estar liberada para criar perfil organizacional.
- O Admin Master não deve precisar criar a organização manualmente por ela.

### Falha crítica

- Rinha Online não consegue acessar o painel mesmo com permissão.
- Conta comum consegue criar organização sem permissão.

---

## 3. Fluxo Rinha Online — criação da organização

### Objetivo
Validar se um organizador externo autorizado consegue criar sua própria organização.

### Passos

1. Entrar com a conta da Rinha Online.
2. Acessar o painel do organizador.
3. Se ainda não existir organização, o sistema deve orientar a criação.
4. Criar o perfil organizacional.
5. Salvar nome, descrição e informações básicas.
6. Abrir/validar página pública da organização.

### Resultado esperado

- Organização criada e vinculada à conta correta.
- Painel do organizador passa a abrir a organização correta automaticamente.
- Página pública da organização fica acessível.

### Falha crítica

- Organização salva sem vínculo com o usuário correto.
- Painel cai em estado confuso ou “organizador não informado”.
- Organização some após atualizar a página.

---

## 4. Fluxo Rinha Online — criação de torneio comum

### Objetivo
Validar criação de torneios reais vinculados à organização.

### Modos sugeridos para teste

- Double Elimination.
- Grupos + Playoffs.
- Pontos Corridos.

### Passos

1. Acessar o painel da organização.
2. Criar novo torneio.
3. Escolher jogo e formato.
4. Preencher nome, descrição, regras básicas e limite de participantes.
5. Configurar janelas:
   - abertura das inscrições;
   - fechamento das inscrições;
   - abertura do check-in;
   - fechamento do check-in.
6. Salvar como rascunho.
7. Revisar pré-validação.
8. Publicar/abrir inscrições somente quando o sistema indicar que está pronto.
9. Abrir página pública do torneio.

### Resultado esperado

- Torneio vinculado à organização da Rinha Online.
- Torneio aparece na listagem pública quando publicado.
- Janelas aparecem corretamente na página pública.
- Pré-validação bloqueia publicação incompleta.

### Falha crítica

- Torneio é criado sem organização vinculada.
- Torneio aparece como se fosse da -SBW- sem ser.
- Torneio incompleto permite chamar jogadores sem janelas configuradas.

---

## 5. Fluxo jogador — inscrição pública

### Objetivo
Validar inscrição real protegida por RPC.

### Cenários mínimos

#### Cenário A — usuário sem login

1. Abrir página pública do torneio.
2. Tentar se inscrever.

Resultado esperado:

- Sistema orienta login/cadastro.
- Nenhuma inscrição é criada.

#### Cenário B — usuário logado

1. Entrar com conta comum.
2. Abrir torneio com inscrição aberta.
3. Fazer inscrição.

Resultado esperado:

- Inscrição criada via RPC.
- Jogador aparece na lista do organizador.
- O botão/status público indica que o jogador já está inscrito.

#### Cenário C — duplicidade

1. Jogador já inscrito tenta se inscrever novamente.

Resultado esperado:

- Sistema bloqueia duplicidade.
- Nenhuma linha duplicada é criada.

#### Cenário D — inscrição fora da janela

1. Tentar inscrição antes da abertura ou depois do fechamento.

Resultado esperado:

- Sistema bloqueia e mostra mensagem clara.

### Falha crítica

- Jogador consegue inserir inscrição duplicada.
- Jogador consegue burlar status pelo Console/API.
- Inscrição aparece sem vínculo com auth.uid() real.

---

## 6. Fluxo jogador — check-in público

### Objetivo
Validar check-in real protegido por RPC.

### Cenários mínimos

#### Cenário A — jogador inscrito e check-in aberto

1. Abrir torneio com check-in aberto.
2. Jogador inscrito faz check-in.

Resultado esperado:

- `check_in_status` vira `checked_in`.
- `checked_in_at` é preenchido.
- Organizador vê o jogador como confirmado.

#### Cenário B — jogador não inscrito

1. Usuário não inscrito tenta fazer check-in.

Resultado esperado:

- Sistema bloqueia.

#### Cenário C — check-in fora da janela

1. Jogador tenta confirmar antes ou depois da janela.

Resultado esperado:

- Sistema bloqueia.

#### Cenário D — duplicidade de check-in

1. Jogador já confirmado tenta fazer check-in novamente.

Resultado esperado:

- Sistema informa que presença já está confirmada.

### Falha crítica

- Jogador não inscrito consegue check-in.
- Jogador consegue alterar status diretamente pelo Console/API.
- Organizador não vê confirmados.

---

## 7. Fluxo organizador — gestão de inscritos e check-in

### Objetivo
Validar se a Rinha Online consegue acompanhar jogadores reais.

### Passos

1. Abrir torneio no painel do organizador.
2. Ver lista de inscritos.
3. Usar filtros:
   - ativos;
   - pendentes de check-in;
   - check-in feito;
   - lista de espera;
   - removidos;
   - todos.
4. Atualizar lista.
5. Copiar chamada, se necessário.
6. Conferir pendentes antes de iniciar o torneio.

### Resultado esperado

- Organizador sabe quem está inscrito e quem confirmou presença.
- Estados vazios não parecem erro.
- Copiar chamada funciona ou abre fallback manual.

---

## 8. Fluxo Team Battle League 4v4 — validação de segurança mínima

O Team Battle League 4v4 não é o foco de inscrição individual neste teste.

### Regras obrigatórias

- Nome do formato permanece **Team Battle League 4v4**.
- Inscrição individual deve ser bloqueada.
- A inscrição correta será por equipe em etapa própria futura.
- Os 4 jogadores devem pertencer à mesma equipe real da plataforma.
- Não permitir mistura de jogadores de equipes diferentes.
- Não permitir free agents nesse formato.
- Não criar equipe fake/demo.
- Fase final deve aparecer publicamente como **Playoffs -SBW-** / **Escada -SBW-**, sem referência pública externa.

### Resultado esperado

- Jogador comum não consegue se inscrever individualmente em torneio Team Battle 4v4.
- Página pública orienta que o formato usa inscrição por equipe.

---

## 9. Validação rápida no navegador

Durante cada fluxo, abrir o Console do navegador.

Ignorar apenas:

```txt
favicon.ico 404
```

Reportar qualquer outro erro com:

- página onde ocorreu;
- ação feita;
- texto completo do erro;
- print, se possível.

---

## 10. Critérios para considerar o teste aprovado

O teste pode ser considerado aprovado se:

- Rinha Online cria organização com a própria conta autorizada.
- Rinha Online cria torneio vinculado à própria organização.
- Torneio publicado aparece corretamente para jogadores.
- Jogador logado consegue se inscrever em torneio comum.
- Duplicidade de inscrição é bloqueada.
- Check-in público funciona dentro da janela.
- Check-in fora da janela é bloqueado.
- Organizador vê inscritos e confirmados.
- Estados vazios e erros são compreensíveis.
- Team Battle 4v4 não aceita inscrição individual.
- Nenhum erro crítico aparece no Console.

---

## 11. Registro dos problemas encontrados

Para cada problema encontrado, registrar:

```txt
Página:
Conta usada:
Ação feita:
Resultado esperado:
Resultado real:
Erro no Console:
Print/link:
Prioridade: crítica / alta / média / baixa
```

---

## 12. Próximos patches após o teste

Depois do teste real, priorizar:

1. Correções críticas de inscrição/check-in.
2. Correções no fluxo da Rinha Online.
3. Correções de permissão/organização.
4. Correções de visual apenas se atrapalharem o uso.
5. Inscrição por equipe real para Team Battle League 4v4.
6. Ajustes de resultados/chaves com base no uso real.

Não iniciar Analytics, AdSense ou novos modos antes de resolver falhas encontradas no teste.
