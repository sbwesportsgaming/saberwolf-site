-- -SBW- v1.6.59
-- Configuração de perfil visual do Organizador:
-- upload de logo/banner via Supabase Storage e enquadramento persistido em metadata.organizerAssets.

-- Bucket reaproveitado pelo fluxo já validado de equipes/perfis.
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'sbw-team-assets',
  'sbw-team-assets',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp']::text[]
)
on conflict (id) do update set
  public = true,
  file_size_limit = greatest(coalesce(storage.buckets.file_size_limit, 0), 5242880),
  allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp']::text[];

drop policy if exists "sbw_team_assets_public_read" on storage.objects;
create policy "sbw_team_assets_public_read"
on storage.objects
for select
using (bucket_id = 'sbw-team-assets');

drop policy if exists "sbw_organizer_assets_insert" on storage.objects;
create policy "sbw_organizer_assets_insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'sbw-team-assets'
  and (storage.foldername(name))[1] = 'organizers'
);

drop policy if exists "sbw_organizer_assets_update" on storage.objects;
create policy "sbw_organizer_assets_update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'sbw-team-assets'
  and (storage.foldername(name))[1] = 'organizers'
)
with check (
  bucket_id = 'sbw-team-assets'
  and (storage.foldername(name))[1] = 'organizers'
);

drop policy if exists "sbw_organizer_assets_delete" on storage.objects;
create policy "sbw_organizer_assets_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'sbw-team-assets'
  and (storage.foldername(name))[1] = 'organizers'
);

drop function if exists public.sbw_update_tournament_organizer_media(text, jsonb);

create or replace function public.sbw_update_tournament_organizer_media(
  p_slug text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  payload jsonb := coalesce(p_payload, '{}'::jsonb);
  key_value text := nullif(trim(coalesce(p_slug, '')), '');
  target_organizer public.tournament_organizers;
  saved_organizer public.tournament_organizers;
  current_metadata jsonb;
  current_assets jsonb;
  incoming_assets jsonb := coalesce(
    payload->'organizerAssets',
    payload->'organizer_assets',
    '{}'::jsonb
  );
begin
  if auth.uid() is null then
    raise exception 'Entre na sua conta para editar a mídia do Organizador.';
  end if;

  if key_value is null then
    raise exception 'Organizador não informado.';
  end if;

  select *
    into target_organizer
  from public.tournament_organizers o
  where o.slug = key_value
     or o.id::text = key_value
  limit 1;

  if target_organizer.id is null then
    raise exception 'Organização de Torneios não encontrada.';
  end if;

  if not public.sbw_can_manage_tournament_organizer(coalesce(target_organizer.slug, target_organizer.id::text)) then
    raise exception 'Você não tem permissão para editar a mídia desta Organização de Torneios.';
  end if;

  current_metadata := coalesce(target_organizer.metadata, '{}'::jsonb);
  current_assets := coalesce(current_metadata->'organizerAssets', '{}'::jsonb);

  update public.tournament_organizers
  set
    logo_url = case
      when payload ? 'logoUrl' then nullif(payload->>'logoUrl', '')
      when payload ? 'logo_url' then nullif(payload->>'logo_url', '')
      else target_organizer.logo_url
    end,
    banner_url = case
      when payload ? 'bannerUrl' then nullif(payload->>'bannerUrl', '')
      when payload ? 'banner_url' then nullif(payload->>'banner_url', '')
      else target_organizer.banner_url
    end,
    metadata = current_metadata || jsonb_build_object(
      'organizerAssets',
      current_assets || incoming_assets,
      'mediaUpdatedAt',
      now(),
      'mediaUpdatedByAuthUserId',
      auth.uid(),
      'mediaUpdatedSource',
      'organizer-media-v1.6.59'
    ),
    updated_at = now()
  where id = target_organizer.id
  returning * into saved_organizer;

  return jsonb_build_object(
    'ok', true,
    'message', 'Mídia do Organizador atualizada.',
    'organizer', to_jsonb(saved_organizer)
  );
end;
$$;

grant execute on function public.sbw_update_tournament_organizer_media(text, jsonb) to authenticated;

select pg_notify('pgrst', 'reload schema');
