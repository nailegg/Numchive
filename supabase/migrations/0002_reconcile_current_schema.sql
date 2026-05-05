create extension if not exists pgcrypto;

alter table people
  add column if not exists role text[];

alter table show_cast
  add column if not exists id uuid default gen_random_uuid(),
  add column if not exists character_name text;

update show_cast
set id = gen_random_uuid()
where id is null;

alter table show_cast
  alter column id set not null;

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'number_actor'
  ) and not exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'number_cast'
  ) then
    alter table number_actor rename to number_cast;
  end if;
end $$;

alter table number_cast
  add column if not exists id uuid default gen_random_uuid(),
  add column if not exists is_ensemble boolean not null default false;

update number_cast
set id = gen_random_uuid()
where id is null;

alter table number_cast
  alter column id set not null;
