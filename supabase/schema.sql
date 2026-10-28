-- Arawali Textile: enquiries captured from the website.
-- Run once in the Supabase SQL editor.

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  company text,
  email text not null,
  phone text,
  country text,
  product text,
  quantity text,
  message text,
  source text not null default 'website',
  status text not null default 'new'   -- new, quoted, sample, won, lost
    check (status in ('new', 'quoted', 'sample', 'won', 'lost'))
);

create index if not exists leads_created_at_idx on leads (created_at desc);
create index if not exists leads_status_idx on leads (status);

alter table leads enable row level security;
-- No public policies: inserts happen only from the server with the service role key.
