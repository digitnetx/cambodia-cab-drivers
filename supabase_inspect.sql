-- Run this in Supabase Dashboard → SQL Editor.
-- Read-only schema inventory for the public schema.

-- 1) Tables and whether Row Level Security (RLS) is enabled.
select
  c.relname as table_name,
  case when c.relrowsecurity then 'enabled' else 'disabled' end as rls_status,
  coalesce(obj_description(c.oid, 'pg_class'), '') as table_description
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'r'
order by c.relname;

-- 2) Columns, data types, defaults, and nullable settings.
select
  table_name,
  ordinal_position,
  column_name,
  data_type,
  udt_name as postgres_type,
  is_nullable,
  column_default
from information_schema.columns
where table_schema = 'public'
order by table_name, ordinal_position;

-- 3) Primary keys, unique constraints, check constraints, and foreign keys.
select
  tbl.relname as table_name,
  con.conname as constraint_name,
  case con.contype
    when 'p' then 'PRIMARY KEY'
    when 'u' then 'UNIQUE'
    when 'c' then 'CHECK'
    when 'f' then 'FOREIGN KEY'
  end as constraint_type,
  pg_get_constraintdef(con.oid, true) as definition
from pg_constraint con
join pg_class tbl on tbl.oid = con.conrelid
join pg_namespace ns on ns.oid = tbl.relnamespace
where ns.nspname = 'public'
order by tbl.relname, constraint_type, con.conname;

-- 4) Foreign-key relationships with their update/delete behavior.
select
  child.relname as child_table,
  child_attr.attname as child_column,
  parent.relname as parent_table,
  parent_attr.attname as parent_column,
  case con.confupdtype
    when 'a' then 'NO ACTION' when 'r' then 'RESTRICT'
    when 'c' then 'CASCADE' when 'n' then 'SET NULL'
    when 'd' then 'SET DEFAULT'
  end as on_update,
  case con.confdeltype
    when 'a' then 'NO ACTION' when 'r' then 'RESTRICT'
    when 'c' then 'CASCADE' when 'n' then 'SET NULL'
    when 'd' then 'SET DEFAULT'
  end as on_delete,
  con.conname as constraint_name
from pg_constraint con
join pg_class child on child.oid = con.conrelid
join pg_namespace ns on ns.oid = child.relnamespace
join pg_class parent on parent.oid = con.confrelid
cross join lateral unnest(con.conkey) with ordinality as child_key(attnum, pos)
cross join lateral unnest(con.confkey) with ordinality as parent_key(attnum, pos)
join pg_attribute child_attr
  on child_attr.attrelid = child.oid and child_attr.attnum = child_key.attnum
join pg_attribute parent_attr
  on parent_attr.attrelid = parent.oid and parent_attr.attnum = parent_key.attnum
where ns.nspname = 'public'
  and con.contype = 'f'
  and child_key.pos = parent_key.pos
order by child_table, con.conname, child_key.pos;

-- 5) RLS policies and their commands / rules.
select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as command,
  qual as using_expression,
  with_check as with_check_expression
from pg_policies
where schemaname = 'public'
order by tablename, policyname;

-- 6) Non-primary indexes, useful for spotting missing or duplicate indexes.
select
  schemaname,
  tablename,
  indexname,
  indexdef
from pg_indexes
where schemaname = 'public'
order by tablename, indexname;

-- 7) Public views, functions, and triggers that affect database behavior.
select table_name as view_name, view_definition
from information_schema.views
where table_schema = 'public'
order by table_name;

select
  routine_name,
  routine_type,
  data_type as return_type
from information_schema.routines
where specific_schema = 'public'
order by routine_name;

select
  event_object_table as table_name,
  trigger_name,
  event_manipulation as event,
  action_timing,
  action_statement
from information_schema.triggers
where trigger_schema = 'public'
order by event_object_table, trigger_name;
