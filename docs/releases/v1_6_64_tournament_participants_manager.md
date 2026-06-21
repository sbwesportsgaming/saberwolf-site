# v1.6.64 — Gestão de inscritos e check-in pelo Organizador

## Objetivo

Preparar o painel interno do Organizador para gerenciar inscritos reais de cada torneio dentro da plataforma -SBW-.

## Alterações

- Adiciona painel de inscritos dentro da aba Torneios do Organizador.
- Adiciona botão **Inscritos** em cada torneio listado.
- Lista participantes reais vinculados ao torneio.
- Exibe resumo de inscritos, check-in, lista de espera e removidos.
- Permite check-in manual pelo organizador.
- Permite remover inscrição sem apagar histórico.
- Atualiza contador de participantes após alteração.
- Cria RPCs seguras para gestão de participantes no Supabase.

## Arquivos alterados

- `torneios/editar-organizador.html`
- `js/tournaments/tournament-organizer-admin-page.js`
- `js/tournaments/tournaments-storage.js`
- `css/tournaments/tournament-organizer-admin.css`
- `docs/sql/v1_6_64_tournament_participants_manager.sql`

## SQL obrigatório

Antes de testar a gestão de inscritos, execute:

```sql
-- docs/sql/v1_6_64_tournament_participants_manager.sql
```

## Teste recomendado

1. Rodar o SQL da v1.6.64 no Supabase.
2. Abrir `/torneios/editar-organizador.html?slug=SUA_ORGANIZACAO`.
3. Entrar na aba **Torneios**.
4. Clicar em **Inscritos** no torneio real.
5. Conferir se inscritos reais aparecem.
6. Fazer check-in manual de um inscrito.
7. Reverter check-in.
8. Remover uma inscrição de teste, se necessário.
9. Conferir se o contador de participantes atualiza.

## Observações

- Não gera chaves/estrutura ainda.
- Não mexe em resultados.
- Não cria participantes fake.
- A remoção usa status `removed`, preservando histórico.
