-- Arawali Textile: enquiries captured from the website.

create table if not exists public.leads (
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

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);

alter table public.leads enable row level security;
-- No public policies: inserts happen only from the server with the service role key.
-- Grant explicitly in case new tables aren't auto-exposed to the Data API.
grant select, insert, update, delete on table public.leads to service_role;
revoke all on table public.leads from anon, authenticated;
