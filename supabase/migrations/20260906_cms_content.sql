-- Central Supabase-backed CMS store for the website’s existing content model.
-- Run this once in Supabase SQL Editor before deploying the app update.

create table if not exists public.cms_content (
  id text primary key default 'main' check (id = 'main'),
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.cms_content enable row level security;

drop policy if exists "Public read CMS content" on public.cms_content;
create policy "Public read CMS content"
  on public.cms_content for select
  using (true);

drop policy if exists "Admins manage CMS content" on public.cms_content;
create policy "Admins manage CMS content"
  on public.cms_content for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

insert into public.cms_content (id, content)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;

-- Keep the modification timestamp accurate for every CMS save.
create or replace function public.touch_cms_content_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_touch_cms_content_updated_at on public.cms_content;
create trigger trg_touch_cms_content_updated_at
before update on public.cms_content
for each row execute function public.touch_cms_content_updated_at();
