-- =========================================================
-- v1.6.80.6 — Analytics agregado no Admin Master
-- =========================================================
-- Objetivo:
-- - Permitir que Admin Master/Admin SBW veja gráficos agregados.
-- - Não expor dados pessoais.
-- - Não liberar leitura direta da tabela site_analytics_events.
-- =========================================================

create table if not exists public.site_analytics_events (
  id bigserial primary key,
  event_type text not null default 'page_view',
  event_name text not null default 'page_view',
  page_path text not null default '/',
  page_title text,
  page_category text not null default 'site',
  referrer_path text,
  device_type text,
  browser_family text,
  os_family text,
  is_pwa boolean not null default false,
  viewport_width integer,
  viewport_height integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.site_analytics_events enable row level security;

revoke all on public.site_analytics_events from anon;
revoke all on public.site_analytics_events from authenticated;

drop policy if exists "site analytics no direct read" on public.site_analytics_events;
drop policy if exists "site analytics no direct write" on public.site_analytics_events;

create index if not exists site_analytics_events_created_at_idx
  on public.site_analytics_events (created_at desc);

create index if not exists site_analytics_events_page_path_idx
  on public.site_analytics_events (page_path);

create index if not exists site_analytics_events_event_type_idx
  on public.site_analytics_events (event_type);

create index if not exists site_analytics_events_page_category_idx
  on public.site_analytics_events (page_category);

create index if not exists site_analytics_events_created_type_idx
  on public.site_analytics_events (created_at desc, event_type);

create index if not exists site_analytics_events_pwa_idx
  on public.site_analytics_events (is_pwa, created_at desc);

drop function if exists public.sbw_admin_get_site_analytics_summary(integer);

create or replace function public.sbw_admin_get_site_analytics_summary(p_days integer default 7)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  safe_days integer := least(greatest(coalesce(p_days, 7), 1), 90);
  since_at timestamptz;
  result jsonb;
begin
  if to_regclass('public.site_analytics_events') is null then
    return jsonb_build_object(
      'ok', false,
      'message', 'A tabela site_analytics_events ainda não existe. Rode primeiro o SQL da v1.6.80.0.'
    );
  end if;

  if not public.sbw_admin_panel_can_manage() then
    raise exception 'Apenas Admin Master/Admin SBW pode visualizar analytics agregados.';
  end if;

  since_at := now() - make_interval(days => safe_days);

  with filtered as (
    select *
    from public.site_analytics_events
    where created_at >= since_at
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
    from generate_series(current_date - (safe_days - 1), current_date, interval '1 day') gs
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
  pages as (
    select coalesce(jsonb_agg(row order by (row->>'views')::integer desc), '[]'::jsonb) as data
    from (
      select jsonb_build_object(
        'path', left(coalesce(nullif(page_path, ''), '/'), 80),
        'views', count(*)::integer
      ) as row
      from filtered
      where event_type = 'page_view'
      group by page_path
      order by count(*) desc
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
  pwa_split as (
    select jsonb_build_array(
      jsonb_build_object('label', 'App/PWA', 'views', (select pwa_views from totals)),
      jsonb_build_object('label', 'Navegador', 'views', (select browser_views from totals))
    ) as data
  )
  select jsonb_build_object(
    'ok', true,
    'days', safe_days,
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
    'pwa', coalesce(pwa_split.data, '[]'::jsonb)
  ) into result
  from totals t, daily, pages, categories, devices, pwa_split;

  return result;
end;
$$;

grant execute on function public.sbw_admin_get_site_analytics_summary(integer) to authenticated;

notify pgrst, 'reload schema';
