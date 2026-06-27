-- =========================================================
-- v1.6.80.0 — Base Analytics segura da plataforma -SBW-
-- =========================================================
-- Objetivo:
-- - Coletar métricas agregadas de uso da plataforma.
-- - Não coletar e-mail, nome, IP completo, user-agent completo ou fingerprint.
-- - Não depender do analytics para o site funcionar.
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

create or replace function public.sbw_analytics_clean_text(p_value text, p_max integer default 160)
returns text
language sql
immutable
as $$
  select nullif(left(regexp_replace(coalesce(p_value, ''), '[[:cntrl:]]+', ' ', 'g'), greatest(coalesce(p_max, 160), 1)), '');
$$;

drop function if exists public.sbw_track_site_event(jsonb);

create or replace function public.sbw_track_site_event(p_event jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  payload jsonb := coalesce(p_event, '{}'::jsonb);
  clean_event_type text;
  clean_event_name text;
  clean_page_path text;
  clean_page_title text;
  clean_page_category text;
  clean_referrer_path text;
  clean_device_type text;
  clean_browser_family text;
  clean_os_family text;
  clean_metadata jsonb;
  inserted_id bigint;
begin
  clean_event_type := lower(coalesce(public.sbw_analytics_clean_text(payload->>'event_type', 40), 'page_view'));
  clean_event_name := lower(coalesce(public.sbw_analytics_clean_text(payload->>'event_name', 80), clean_event_type));
  clean_page_path := coalesce(public.sbw_analytics_clean_text(payload->>'page_path', 180), '/');
  clean_page_title := public.sbw_analytics_clean_text(payload->>'page_title', 140);
  clean_page_category := lower(coalesce(public.sbw_analytics_clean_text(payload->>'page_category', 60), 'site'));
  clean_referrer_path := public.sbw_analytics_clean_text(payload->>'referrer_path', 160);
  clean_device_type := lower(coalesce(public.sbw_analytics_clean_text(payload->>'device_type', 30), 'unknown'));
  clean_browser_family := lower(coalesce(public.sbw_analytics_clean_text(payload->>'browser_family', 30), 'unknown'));
  clean_os_family := lower(coalesce(public.sbw_analytics_clean_text(payload->>'os_family', 30), 'unknown'));

  if clean_event_type not in ('page_view', 'click', 'pwa_event', 'site_event') then
    clean_event_type := 'site_event';
  end if;

  if clean_device_type not in ('mobile', 'tablet', 'desktop', 'unknown') then
    clean_device_type := 'unknown';
  end if;

  clean_metadata := case
    when jsonb_typeof(payload->'metadata') = 'object' then payload->'metadata'
    else '{}'::jsonb
  end;

  -- Remove campos que poderiam conter dados pessoais, mesmo que enviados por engano.
  clean_metadata := clean_metadata
    - 'email'
    - 'user_email'
    - 'name'
    - 'full_name'
    - 'display_name'
    - 'username'
    - 'nickname'
    - 'auth_user_id'
    - 'user_id'
    - 'profile_id'
    - 'ip'
    - 'ip_address'
    - 'user_agent'
    - 'fingerprint';

  insert into public.site_analytics_events (
    event_type,
    event_name,
    page_path,
    page_title,
    page_category,
    referrer_path,
    device_type,
    browser_family,
    os_family,
    is_pwa,
    viewport_width,
    viewport_height,
    metadata
  ) values (
    clean_event_type,
    clean_event_name,
    clean_page_path,
    clean_page_title,
    clean_page_category,
    clean_referrer_path,
    clean_device_type,
    clean_browser_family,
    clean_os_family,
    coalesce((payload->>'is_pwa')::boolean, false),
    nullif(payload->>'viewport_width', '')::integer,
    nullif(payload->>'viewport_height', '')::integer,
    clean_metadata
  ) returning id into inserted_id;

  return jsonb_build_object(
    'ok', true,
    'event_id', inserted_id
  );
exception
  when others then
    -- A RPC nunca deve quebrar o fluxo do site; retorna erro controlado.
    return jsonb_build_object(
      'ok', false,
      'message', sqlerrm
    );
end;
$$;

grant execute on function public.sbw_track_site_event(jsonb) to anon;
grant execute on function public.sbw_track_site_event(jsonb) to authenticated;

notify pgrst, 'reload schema';
