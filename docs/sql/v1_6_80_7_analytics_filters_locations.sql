-- =========================================================
-- v1.6.80.7 — Analytics: filtros por período, nomes amigáveis e origem aproximada
-- =========================================================
-- Objetivo:
-- - Permitir filtros 7/15/30/90 dias e período personalizado.
-- - Retornar páginas com nomes práticos para o Admin Master.
-- - Preparar origem aproximada agregada sem IP e sem dados pessoais.
-- Observação:
-- - País/estado/região real exige uma fonte geográfica externa/servidor.
-- - Este SQL só agrega campos seguros existentes no metadata, como timezone/idioma,
--   e também suporta country/region/state caso uma integração futura preencha esses campos.
-- =========================================================

drop function if exists public.sbw_admin_get_site_analytics_summary(integer);
drop function if exists public.sbw_admin_get_site_analytics_summary(integer, date, date);

create or replace function public.sbw_admin_get_site_analytics_summary(
  p_days integer default 7,
  p_start_date date default null,
  p_end_date date default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  safe_days integer := least(greatest(coalesce(p_days, 7), 1), 180);
  safe_start date;
  safe_end date;
  temp_date date;
  range_days integer;
  start_at timestamptz;
  end_at timestamptz;
  result jsonb;
begin
  if to_regclass('public.site_analytics_events') is null then
    return jsonb_build_object(
      'ok', false,
      'message', 'A tabela site_analytics_events ainda não existe. Rode primeiro o SQL da base de analytics.'
    );
  end if;

  if not public.sbw_admin_panel_can_manage() then
    raise exception 'Apenas Admin Master/Admin SBW pode visualizar analytics agregados.';
  end if;

  if p_start_date is not null and p_end_date is not null then
    safe_start := p_start_date;
    safe_end := p_end_date;
  else
    safe_end := current_date;
    safe_start := safe_end - (safe_days - 1);
  end if;

  if safe_start > safe_end then
    temp_date := safe_start;
    safe_start := safe_end;
    safe_end := temp_date;
  end if;

  -- Evita consultas muito grandes no painel. Para histórico maior, criar relatório próprio depois.
  if safe_start < safe_end - 179 then
    safe_start := safe_end - 179;
  end if;

  range_days := (safe_end - safe_start) + 1;
  start_at := safe_start::timestamptz;
  end_at := (safe_end + 1)::timestamptz;

  with filtered as (
    select *
    from public.site_analytics_events
    where created_at >= start_at
      and created_at < end_at
  ),
  totals as (
    select
      count(*)::integer as events,
      count(*) filter (where event_type = 'page_view')::integer as page_views,
      count(*) filter (where event_type = 'click')::integer as clicks,
      count(*) filter (where event_type = 'page_view' and is_pwa = true)::integer as pwa_views,
      count(*) filter (where event_type = 'page_view' and coalesce(is_pwa, false) = false)::integer as browser_views
    from filtered
  ),
  daily_source as (
    select gs::date as day
    from generate_series(safe_start::timestamp, safe_end::timestamp, interval '1 day') gs
  ),
  daily_counts as (
    select
      ds.day,
      count(f.id) filter (where f.event_type = 'page_view')::integer as views
    from daily_source ds
    left join filtered f on f.created_at::date = ds.day
    group by ds.day
  ),
  daily as (
    select jsonb_agg(
      jsonb_build_object(
        'date', to_char(day, 'YYYY-MM-DD'),
        'views', coalesce(views, 0)
      ) order by day
    ) as data
    from daily_counts
  ),
  page_rows as (
    select
      page_path,
      max(page_title) as page_title,
      count(*)::integer as views
    from filtered
    where event_type = 'page_view'
    group by page_path
  ),
  pages as (
    select coalesce(jsonb_agg(row order by (row->>'views')::integer desc), '[]'::jsonb) as data
    from (
      select jsonb_build_object(
        'path', left(coalesce(nullif(page_path, ''), '/'), 120),
        'page_title', left(coalesce(nullif(page_title, ''), ''), 120),
        'label', case
          when page_path = '/' or page_path ilike '%/index.html' then 'Início'
          when page_path ilike '%/admin/%' then 'Admin Master'
          when page_path ilike '%/equipes/minha-equipe%' then 'Minha equipe'
          when page_path ilike '%/equipes/equipe%' then 'Perfil público de equipe'
          when page_path ilike '%/equipes/criar-equipe%' then 'Criar equipe'
          when page_path ilike '%/equipes/equipes%' then 'Equipes'
          when page_path ilike '%/torneios/torneio%' then 'Detalhe do torneio'
          when page_path ilike '%/torneios/criar%' then 'Criar torneio'
          when page_path ilike '%/torneios/%' then 'Torneios'
          when page_path ilike '%/organizadores/%' then 'Organizadores'
          when page_path ilike '%/rankings/%' then 'Rankings'
          when page_path ilike '%/perfis/perfil%' then 'Perfil público'
          when page_path ilike '%/perfis/%' then 'Perfis'
          when page_path ilike '%/comunidades/%' then 'Comunidades'
          when page_path ilike '%/creators/%' then 'Creators'
          when page_path ilike '%/blog/noticia%' then 'Notícia'
          when page_path ilike '%/blog/%' then 'Notícias'
          when page_path ilike '%/pages/loja%' or page_path ilike '%/loja%' then 'Loja'
          when page_path ilike '%/transferencias/%' then 'Transferências'
          when page_path ilike '%/sobre%' then 'Sobre'
          else left(coalesce(nullif(page_title, ''), nullif(page_path, ''), 'Página não informada'), 80)
        end,
        'views', views
      ) as row
      from page_rows
      order by views desc
      limit 8
    ) q
  ),
  categories as (
    select coalesce(jsonb_agg(row order by (row->>'views')::integer desc), '[]'::jsonb) as data
    from (
      select jsonb_build_object(
        'category', coalesce(nullif(page_category, ''), 'site'),
        'views', count(*)::integer
      ) as row
      from filtered
      where event_type = 'page_view'
      group by page_category
      order by count(*) desc
      limit 8
    ) q
  ),
  devices as (
    select coalesce(jsonb_agg(row order by (row->>'views')::integer desc), '[]'::jsonb) as data
    from (
      select jsonb_build_object(
        'device', coalesce(nullif(device_type, ''), 'unknown'),
        'views', count(*)::integer
      ) as row
      from filtered
      where event_type = 'page_view'
      group by device_type
      order by count(*) desc
      limit 6
    ) q
  ),
  location_labels as (
    select
      case
        when nullif(metadata->>'country', '') is not null then concat_ws(' · ', nullif(metadata->>'country', ''), nullif(metadata->>'region', ''), nullif(metadata->>'state', ''))
        when nullif(metadata->>'timezone', '') is not null then 'Fuso: ' || nullif(metadata->>'timezone', '')
        when nullif(metadata->>'browser_language', '') is not null then 'Idioma: ' || nullif(metadata->>'browser_language', '')
        else 'Não informado'
      end as label
    from filtered
    where event_type = 'page_view'
  ),
  locations as (
    select coalesce(jsonb_agg(row order by (row->>'views')::integer desc), '[]'::jsonb) as data
    from (
      select jsonb_build_object(
        'label', left(label, 90),
        'views', count(*)::integer
      ) as row
      from location_labels
      where label <> 'Não informado'
      group by label
      order by count(*) desc
      limit 8
    ) q
  ),
  pwa_split as (
    select jsonb_build_array(
      jsonb_build_object('label', 'App/PWA', 'views', (select pwa_views from totals)),
      jsonb_build_object('label', 'Navegador', 'views', (select browser_views from totals))
    ) as data
  )
  select jsonb_build_object(
    'ok', true,
    'mode', case when p_start_date is not null and p_end_date is not null then 'custom' else 'days' end,
    'days', range_days,
    'period', jsonb_build_object(
      'start_date', to_char(safe_start, 'YYYY-MM-DD'),
      'end_date', to_char(safe_end, 'YYYY-MM-DD')
    ),
    'totals', jsonb_build_object(
      'events', t.events,
      'page_views', t.page_views,
      'clicks', t.clicks,
      'pwa_views', t.pwa_views,
      'browser_views', t.browser_views
    ),
    'daily', coalesce(daily.data, '[]'::jsonb),
    'pages', coalesce(pages.data, '[]'::jsonb),
    'categories', coalesce(categories.data, '[]'::jsonb),
    'devices', coalesce(devices.data, '[]'::jsonb),
    'pwa', coalesce(pwa_split.data, '[]'::jsonb),
    'locations', coalesce(locations.data, '[]'::jsonb)
  ) into result
  from totals t, daily, pages, categories, devices, locations, pwa_split;

  return result;
end;
$$;

grant execute on function public.sbw_admin_get_site_analytics_summary(integer, date, date) to authenticated;

notify pgrst, 'reload schema';
