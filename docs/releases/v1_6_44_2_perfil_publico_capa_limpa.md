# v1.6.44.2 — Perfil público: capa limpa e identidade mínima

Ajuste visual fino do perfil público da equipe após validação do upload real de logo/banner.

## Alterações
- Banner público ganhou mais altura e menos camada escura para a arte aparecer melhor.
- Logo pública ficou menor e usa `object-fit: contain`, evitando cortes e rebarbas visuais em logos quadradas.
- Nome da equipe permanece fora do banner, na faixa inferior.
- Hero público passa a mostrar somente logo, nome e selo de verificação visual.
- Informações duplicadas foram retiradas do hero e concentradas no card “Informações públicas”.
- Card “Informações públicas” recebeu identidade, membros e recrutamento.

## Não altera
- Supabase Storage.
- Policies/RLS.
- Upload real já validado.
- Minha Equipe.
- Sidebar.

## Observação
O ajuste de zoom/reposicionamento fino de banner/logo será tratado em etapa própria, com controles de enquadramento.
