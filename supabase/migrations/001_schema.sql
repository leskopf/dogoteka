-- Majitelé psů
create table owners (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  phone text not null,
  phone_emergency text,
  email text,
  address text,
  is_recurring boolean default false,
  created_at timestamptz default now()
);

-- Psi
create table dogs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references owners(id) on delete cascade,
  name text not null,
  breed text,
  passport_number text,
  chip_number text,
  weight_kg numeric(5,2),
  food_notes text,
  medication text,
  vet_name text,
  vet_phone text,
  extra_notes text,
  photo_url text,
  created_at timestamptz default now()
);

-- Tagy na psy
create table dog_tags (
  id uuid primary key default gen_random_uuid(),
  dog_id uuid references dogs(id) on delete cascade,
  label text not null,
  color text not null default '#888'
);

-- Termíny hlídání
create table stays (
  id uuid primary key default gen_random_uuid(),
  dog_id uuid references dogs(id) on delete cascade,
  date_from date not null,
  date_to date not null,
  notes text,
  created_at timestamptz default now()
);

-- Notes / timeline zápisky z pobytu
create table stay_notes (
  id uuid primary key default gen_random_uuid(),
  stay_id uuid references stays(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

-- Fotky psů (více fotek na psa)
create table dog_photos (
  id uuid primary key default gen_random_uuid(),
  dog_id uuid references dogs(id) on delete cascade,
  storage_path text not null,
  is_primary boolean default false,
  created_at timestamptz default now()
);

-- Share tokeny pro read-only view majitele
create table share_tokens (
  id uuid primary key default gen_random_uuid(),
  dog_id uuid references dogs(id) on delete cascade,
  token text unique not null default encode(gen_random_bytes(16), 'hex'),
  created_at timestamptz default now()
);

-- Audit log
create table audit_log (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  record_id uuid,
  action text not null,
  changed_by uuid references auth.users(id),
  changed_at timestamptz default now(),
  old_data jsonb,
  new_data jsonb
);

-- Nastavení kapacity
create table settings (
  id int primary key default 1,
  max_capacity int default 5
);
