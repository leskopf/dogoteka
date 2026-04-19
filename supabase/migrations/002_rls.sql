-- Enable RLS on all tables
alter table owners enable row level security;
alter table dogs enable row level security;
alter table dog_tags enable row level security;
alter table stays enable row level security;
alter table stay_notes enable row level security;
alter table dog_photos enable row level security;
alter table share_tokens enable row level security;
alter table audit_log enable row level security;
alter table settings enable row level security;

-- Admin-only policies (authenticated users can do everything)
create policy "admin_all_owners" on owners
  for all to authenticated using (true) with check (true);

create policy "admin_all_dogs" on dogs
  for all to authenticated using (true) with check (true);

create policy "admin_all_dog_tags" on dog_tags
  for all to authenticated using (true) with check (true);

create policy "admin_all_stays" on stays
  for all to authenticated using (true) with check (true);

create policy "admin_all_stay_notes" on stay_notes
  for all to authenticated using (true) with check (true);

create policy "admin_all_dog_photos" on dog_photos
  for all to authenticated using (true) with check (true);

create policy "admin_all_share_tokens" on share_tokens
  for all to authenticated using (true) with check (true);

create policy "admin_all_audit_log" on audit_log
  for all to authenticated using (true) with check (true);

create policy "admin_all_settings" on settings
  for all to authenticated using (true) with check (true);

-- Public read for share_tokens (anon can look up token to validate)
create policy "anon_read_share_tokens" on share_tokens
  for select to anon using (true);

-- Public read for dog_tags and dog_photos when dog has a share token
create policy "anon_read_dog_tags_via_token" on dog_tags
  for select to anon
  using (exists (select 1 from share_tokens where share_tokens.dog_id = dog_tags.dog_id));

create policy "anon_read_dog_photos_via_token" on dog_photos
  for select to anon
  using (exists (select 1 from share_tokens where share_tokens.dog_id = dog_photos.dog_id));

create policy "anon_read_stays_via_token" on stays
  for select to anon
  using (exists (select 1 from share_tokens where share_tokens.dog_id = stays.dog_id));

create policy "anon_read_stay_notes_via_token" on stay_notes
  for select to anon
  using (exists (
    select 1 from stays s
    join share_tokens st on st.dog_id = s.dog_id
    where s.id = stay_notes.stay_id
  ));

-- Security definer function for public dog lookup by token
-- This lets the share route fetch dog data without direct table access
create or replace function public.get_dog_by_token(p_token text)
returns setof dogs
language sql
security definer
set search_path = public
as $$
  select d.* from dogs d
  join share_tokens st on st.dog_id = d.id
  where st.token = p_token;
$$;

-- Grant execute to anon
grant execute on function public.get_dog_by_token(text) to anon;
