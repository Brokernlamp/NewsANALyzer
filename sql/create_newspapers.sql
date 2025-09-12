-- Create newspapers table for managing newspaper slugs and display names
create table if not exists public.newspapers (
  slug text primary key,
  display_name text not null,
  created_at timestamptz not null default now()
);

-- Add RLS policies for public read access
alter table public.newspapers enable row level security;

-- Allow public read access
create policy "Allow public read access" on public.newspapers
  for select using (true);

-- Allow service role full access (for admin functions)
create policy "Allow service role full access" on public.newspapers
  for all using (auth.role() = 'service_role');

-- Insert some default newspapers
insert into public.newspapers (slug, display_name) values
  ('the-hindu', 'The Hindu'),
  ('indian-express', 'Indian Express'),
  ('times-of-india', 'Times of India'),
  ('hindustan-times', 'Hindustan Times'),
  ('economic-times', 'Economic Times'),
  ('business-standard', 'Business Standard')
on conflict (slug) do nothing;
