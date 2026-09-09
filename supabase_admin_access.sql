-- Run in Supabase Dashboard → SQL Editor.
-- Replace YOUR_ADMIN_EMAIL with the email of an existing Supabase Auth user.
-- This grants full access to that user only; other authenticated users stay restricted.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- Security-definer function avoids recursive RLS checks on admin_users.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- The email must already exist in Authentication → Users.
insert into public.admin_users (user_id)
select id
from auth.users
where email = 'YOUR_ADMIN_EMAIL'
on conflict (user_id) do nothing;

-- Apply one full-access policy for the admin to every current public table.
-- Existing public read and booking/contact submission policies are preserved.
do $$
declare
  item record;
begin
  for item in
    select tablename
    from pg_tables
    where schemaname = 'public'
      and tablename <> 'admin_users'
  loop
    execute format(
      'drop policy if exists %I on public.%I',
      'Admins have full access', item.tablename
    );
    execute format(
      'create policy %I on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())',
      'Admins have full access', item.tablename
    );
  end loop;
end $$;

-- Verification: should return the intended admin email after the insert.
select au.user_id, u.email, au.created_at
from public.admin_users au
join auth.users u on u.id = au.user_id;
