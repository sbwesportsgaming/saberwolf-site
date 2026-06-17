create or replace function public.sbw_update_team_asset_settings(
  team_key text,
  asset_type text,
  position_x numeric,
  position_y numeric,
  zoom_value numeric
)
returns public.teams
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_team public.teams;
  safe_x numeric := least(100, greatest(0, coalesce(position_x, 50)));
  safe_y numeric := least(100, greatest(0, coalesce(position_y, 50)));
  safe_zoom numeric := least(
    case when asset_type = 'banner' then 180 else 160 end,
    greatest(100, coalesce(zoom_value, 100))
  );
  frame jsonb;
begin
  if asset_type not in ('logo', 'banner') then
    raise exception 'Tipo de mídia inválido: %', asset_type;
  end if;

  if not public.sbw_can_manage_team_assets(team_key) then
    raise exception 'Usuário sem permissão para alterar o enquadramento desta equipe.';
  end if;

  frame := jsonb_build_object(
    'positionX', safe_x,
    'positionY', safe_y,
    'zoom', safe_zoom,
    'updatedAt', now()
  );

  update public.teams
  set metadata = jsonb_set(
    coalesce(metadata, '{}'::jsonb),
    array['teamAssets', asset_type],
    frame,
    true
  )
  where slug = team_key or id::text = team_key
  returning * into updated_team;

  if updated_team.id is null then
    raise exception 'Equipe não encontrada para atualizar enquadramento: %', team_key;
  end if;

  return updated_team;
end;
$$;

grant execute on function public.sbw_update_team_asset_settings(text, text, numeric, numeric, numeric) to authenticated;
