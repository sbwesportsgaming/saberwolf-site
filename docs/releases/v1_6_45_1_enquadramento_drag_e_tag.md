# v1.6.45.1 — Enquadramento por arraste e correção de tag

Hotfix sobre a v1.6.45.

## Alterações

- Substitui os controles de slider por enquadramento por arraste na imagem, em estilo rede social.
- Permite clicar e arrastar banner/logo para ajustar o posicionamento.
- Mantém botões simples de zoom +/−.
- Ajusta a área de prévia do banner para trabalhar melhor com imagens 1920×1080.
- Aumenta um pouco a área útil do banner no perfil público para cortar menos imagens 16:9.
- Corrige validação da tag atual da equipe: a tag já pertencente à própria equipe não deve ser marcada como indisponível ao salvar alterações.

## Observações

- Não altera Supabase Storage.
- Não altera RLS.
- Não exige SQL novo se a v1.6.45 já foi configurada.
- Mantém a função `sbw_update_team_asset_settings` usada para salvar o enquadramento.
