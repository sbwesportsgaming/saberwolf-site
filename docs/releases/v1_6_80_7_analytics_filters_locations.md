# v1.6.80.7 — Analytics: filtros, nomes amigáveis e origem aproximada

## Objetivo
Refinar a aba Analytics do Admin Master após a primeira versão visual da v1.6.80.6.

## Ajustes
- Corrige o alinhamento dos botões de período do Analytics.
- Adiciona filtro de 15 dias.
- Adiciona filtro personalizado por calendário com data inicial e final.
- Atualiza os cards de Eventos, Page views, Cliques e PWA/App conforme o período selecionado.
- Troca nomes técnicos de arquivos/caminhos por nomes práticos nas páginas mais acessadas.
- Adiciona card de origem aproximada sem IP e sem dados pessoais.
- Passa a registrar fuso horário e idioma do navegador no metadata dos eventos novos.

## Observação sobre localização
País, estado ou região real não são coletados diretamente pelo navegador com segurança e precisão. Para isso seria necessário uma fonte geográfica no servidor/edge ou serviço externo. Esta versão mantém a diretriz de não coletar dados pessoais e usa apenas dados agregados seguros.

## SQL obrigatório
Rodar no Supabase:

```sql
docs/sql/v1_6_80_7_analytics_filters_locations.sql
```
