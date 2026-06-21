# v1.6.60.4 — Áreas internas separadas no Painel do Organizador

## Objetivo
Deixar a Visão Geral do painel do Organizador como um resumo limpo e mover edição/alteração/configuração para suas abas internas próprias.

## Ajustes
- Visão Geral mostra apenas resumo e ações rápidas.
- Torneios abre uma área dedicada e lista torneios vinculados ao organizador.
- Temporadas abre uma área dedicada com edição de nome, data de início e data de fim da temporada atual.
- Rankings abre uma área dedicada com ranking de jogadores e equipes preparado para Top 5.
- Staff permanece em área dedicada, mantendo o fluxo validado.
- Configurações continua concentrando edição do perfil, banner, logo, links e cores.
- Corrige flash/carregamento inicial que mostrava a versão antiga do painel antes da navegação interna ser ativada.

## Observações
- Não adiciona SQL novo.
- A temporada é salva no metadata do organizador usando o salvamento de perfil existente.
- Rankings continuam dependendo de dados reais de pontuação quando existirem.
