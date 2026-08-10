-- Run once in the Supabase SQL editor.
create table if not exists seeds (
  id uuid primary key,
  created_at timestamptz not null default now(),
  from_name text not null default '',
  to_name text not null default '',
  note text not null,
  flower text not null default 'sunflower',
  waterings int not null default 0,
  blooms_at timestamptz not null default now() + interval '3 days'
);

-- migration if the table already exists without blooms_at:
-- alter table seeds add column if not exists blooms_at timestamptz not null default now() + interval '3 days';
-- update seeds set blooms_at = created_at + interval '3 days';

-- atomic increment so two visitors watering at once both count
create or replace function water_seed(seed_id uuid) returns int as $$
  update seeds set waterings = waterings + 1 where id = seed_id returning waterings;
$$ language sql;
