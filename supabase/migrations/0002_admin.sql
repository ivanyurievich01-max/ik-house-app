-- ============================================================
-- IK-HOUSE — Этап 3: поддержка админ-панели
-- email в profiles (для списков пользователей), синхронизация
-- ============================================================

-- 1) email в profiles
alter table public.profiles add column if not exists email text;

update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id and p.email is distinct from u.email;

-- 2) триггер создания профиля теперь копирует email
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name, phone, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', ''),
    new.email
  )
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

-- 3) синхронизация при смене email
create or replace function public.handle_user_email_update()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.profiles set email = new.email where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_updated on auth.users;
create trigger on_auth_user_email_updated
  after update of email on auth.users
  for each row execute function public.handle_user_email_update();

-- 4) статистика для админ-дашборда одним запросом
create or replace function public.admin_stats()
returns jsonb
language plpgsql
security definer set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'FORBIDDEN';
  end if;
  return jsonb_build_object(
    'users', (select count(*) from public.profiles),
    'owners', (select count(*) from public.owner_profiles),
    'owners_pending', (select count(*) from public.owner_profiles where verification_status = 'pending'),
    'properties', (select count(*) from public.properties),
    'published', (select count(*) from public.properties where status = 'published'),
    'pending_review', (select count(*) from public.properties where status = 'pending_review'),
    'bookings', (select count(*) from public.bookings),
    'bookings_pending', (select count(*) from public.bookings where status = 'pending')
  );
end;
$$;

grant execute on function public.admin_stats() to authenticated;
