-- Permettre aux utilisateurs authentifiés de lire leur domaine (branding, slug, etc.)
drop policy if exists "domains_select_by_profile" on public.domains;

create policy "domains_select_by_profile"
  on public.domains
  for select
  to authenticated
  using (
    id in (
      select domain_id from public.profiles where id = auth.uid()
    )
  );
