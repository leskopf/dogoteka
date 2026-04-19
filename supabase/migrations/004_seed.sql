-- Seed default settings
insert into settings (id, max_capacity)
values (1, 5)
on conflict (id) do nothing;

-- Storage bucket setup instructions (run in Supabase dashboard or via CLI):
-- 1. Create bucket named 'dog-photos' with public access enabled
-- 2. Add storage policy for authenticated uploads:
--    INSERT: (bucket_id = 'dog-photos' AND auth.role() = 'authenticated')
-- 3. Add storage policy for public reads:
--    SELECT: (bucket_id = 'dog-photos')
