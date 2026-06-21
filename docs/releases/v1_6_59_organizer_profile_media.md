# v1.6.59 — Configuração de perfil visual do Organizador

## Objetivo
Criar uma área dedicada de configuração de perfil do Organizador para logo e banner, com comportamento semelhante ao já validado em Perfis e Equipes.

## Arquivos alterados
- `torneios/editar-organizador.html`
- `js/tournaments/tournament-organizer-admin-page.js`
- `js/tournaments/tournament-organizer-page.js`
- `js/tournaments/tournaments-storage.js`
- `css/tournaments/tournament-organizer-admin.css`
- `css/organizers/organizer-profile.css`
- `docs/sql/v1_6_59_organizer_profile_media.sql`

## O que entra
- nova área “Configuração de perfil” no painel interno do Organizador;
- upload de banner e logo via Supabase Storage;
- prévia visual de banner e logo;
- edição de enquadramento com posição horizontal, posição vertical e zoom;
- persistência do enquadramento em `metadata.organizerAssets`;
- aplicação do enquadramento no painel interno e no perfil público;
- fallback avançado por URL manual;
- mantém campos ocultos `organizerBannerUrl` e `organizerLogoUrl` para compatibilidade com o salvamento atual;
- não altera criação de torneio, permissões, staff, inscrições, rankings ou temporadas.

## SQL obrigatório
Rodar `docs/sql/v1_6_59_organizer_profile_media.sql` no Supabase antes de testar upload real.

## Testes
1. Abrir o painel interno do organizador.
2. Ir até Configurações > Configuração de perfil.
3. Enviar banner.
4. Enviar logo.
5. Ajustar enquadramento.
6. Salvar enquadramento.
7. Abrir perfil público e conferir se banner/logo aparecem com o mesmo enquadramento.
8. Confirmar que criação de torneio continua funcionando.
