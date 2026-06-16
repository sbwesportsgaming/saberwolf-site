# v1.6.44 — Upload real de logo e banner da equipe

## Objetivo
Ativar o envio real de logo e banner da equipe pelo painel **Minha Equipe > Perfil público**, usando o bucket público `sbw-team-assets` do Supabase Storage.

## Alterações
- Botões **Alterar banner** e **Alterar logo** passam a abrir seletor de arquivo.
- Validação no navegador:
  - PNG, JPG/JPEG ou WebP.
  - Banner até 4 MB.
  - Logo até 2 MB.
- Upload para caminhos:
  - `teams/<slug-da-equipe>/banner/...`
  - `teams/<slug-da-equipe>/logo/...`
- Após o upload, o link público é salvo automaticamente na equipe.
- O painel é recarregado para exibir a nova imagem.

## Pré-requisito Supabase
Bucket `sbw-team-assets` criado como público, com limite de 5 MB e policies de leitura pública e escrita por capitão/staff da equipe.

## Não incluído nesta etapa
- Crop/zoom/reposicionamento.
- Remoção automática de arquivos antigos.
- Sugestão automática de cores pela imagem.
