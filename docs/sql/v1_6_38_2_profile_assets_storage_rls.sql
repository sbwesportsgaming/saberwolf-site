-- -SBW- v1.6.38.2
-- Libera upload de foto/banner de perfil no bucket público já usado no projeto.
-- Caminho esperado pelo front-end:
-- sbw-team-assets/profiles/<auth.uid()>/avatar/arquivo.ext
-- sbw-team-assets/profiles/<auth.uid()>/banner/arquivo.ext

-- Leitura pública das mídias de perfil.
drop policy if exists "sbw_profile_assets_public_read" on storage.objects;
create policy "sbw_profile_assets_public_read"
on storage.objects
for select
to public
using (
  bucket_id = 'sbw-team-assets'
  and (storage.foldername(name))[1] = 'profiles'
);

-- Usuário autenticado pode inserir mídias apenas na própria pasta auth.uid().
drop policy if exists "sbw_profile_assets_insert_own" on storage.objects;
create policy "sbw_profile_assets_insert_own"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'sbw-team-assets'
  and (storage.foldername(name))[1] = 'profiles'
  and (storage.foldername(name))[2] = auth.uid()::text
  and (storage.foldername(name))[3] in ('avatar', 'banner')
);

-- Usuário autenticado pode atualizar/substituir mídias apenas na própria pasta.
drop policy if exists "sbw_profile_assets_update_own" on storage.objects;
create policy "sbw_profile_assets_update_own"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'sbw-team-assets'
  and (storage.foldername(name))[1] = 'profiles'
  and (storage.foldername(name))[2] = auth.uid()::text
  and (storage.foldername(name))[3] in ('avatar', 'banner')
)
with check (
  bucket_id = 'sbw-team-assets'
  and (storage.foldername(name))[1] = 'profiles'
  and (storage.foldername(name))[2] = auth.uid()::text
  and (storage.foldername(name))[3] in ('avatar', 'banner')
);

-- Usuário autenticado pode apagar mídias antigas apenas da própria pasta.
drop policy if exists "sbw_profile_assets_delete_own" on storage.objects;
create policy "sbw_profile_assets_delete_own"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'sbw-team-assets'
  and (storage.foldername(name))[1] = 'profiles'
  and (storage.foldername(name))[2] = auth.uid()::text
  and (storage.foldername(name))[3] in ('avatar', 'banner')
);
