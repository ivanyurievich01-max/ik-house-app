-- ============================================================
-- IK-HOUSE — Этап 1: базовая схема платформы
-- Пользователи, объекты, заявки, избранное, отзывы, уведомления
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- ENUMS ----------
create type public.user_role as enum ('guest', 'owner', 'admin');
create type public.user_status as enum ('active', 'suspended', 'blocked');
create type public.owner_type as enum ('individual', 'entrepreneur', 'company');
create type public.verification_status as enum ('unverified', 'pending', 'verified', 'rejected');
create type public.property_type as enum ('cottage', 'guesthouse', 'resort', 'villa', 'apartment', 'house', 'room');
create type public.property_status as enum ('draft', 'pending_review', 'published', 'rejected', 'archived', 'suspended');
create type public.booking_status as enum ('pending', 'confirmed', 'declined', 'cancelled', 'completed');
create type public.availability_status as enum ('available', 'blocked', 'booked');
create type public.review_status as enum ('pending', 'published', 'rejected');

-- ---------- PROFILES ----------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null default '',
  last_name text not null default '',
  phone text,
  avatar_url text,
  role public.user_role not null default 'guest',
  status public.user_status not null default 'active',
  phone_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Профиль создаётся автоматически при регистрации
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at helper
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger trg_profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- Проверка admin без рекурсии RLS
create or replace function public.is_admin()
returns boolean
language sql stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and status = 'active'
  );
$$;

-- ---------- OWNER PROFILES ----------
create table public.owner_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  owner_type public.owner_type not null default 'individual',
  display_name text not null,
  whatsapp text,
  about text,
  avatar_url text,
  verification_status public.verification_status not null default 'pending',
  public_phone text,
  show_public_contact boolean not null default true,
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_owner_profiles_touch before update on public.owner_profiles
  for each row execute function public.touch_updated_at();

create or replace function public.is_owner_user(p_owner_id uuid)
returns boolean
language sql stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.owner_profiles
    where id = p_owner_id and user_id = auth.uid()
  );
$$;

-- ---------- AMENITIES ----------
create table public.amenities (
  key text primary key,
  label text not null,
  sort_order int not null default 0
);

insert into public.amenities (key, label, sort_order) values
  ('wifi', 'Wi-Fi', 1),
  ('parking', 'Парковка', 2),
  ('kitchen', 'Кухня', 3),
  ('ac', 'Кондиционер', 4),
  ('tv', 'Телевизор', 5),
  ('washer', 'Стиральная машина', 6),
  ('shower', 'Душ', 7),
  ('bath', 'Ванна', 8),
  ('bbq', 'Мангал', 9),
  ('terrace', 'Терраса', 10),
  ('balcony', 'Балкон', 11),
  ('pool', 'Бассейн', 12),
  ('beach', 'Пляж рядом', 13),
  ('breakfast', 'Завтрак', 14),
  ('playground', 'Детская площадка', 15),
  ('lake_view', 'Вид на озеро', 16),
  ('mountain_view', 'Вид на горы', 17);

-- ---------- PROPERTIES ----------
create table public.properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.owner_profiles (id) on delete set null,
  slug text not null unique,
  title text not null,
  type public.property_type not null,
  short_description text,
  description text not null default '',
  shore text not null check (shore in ('north', 'south')),
  location text not null,
  address text not null default '',
  latitude double precision,
  longitude double precision,
  distance_to_beach int,
  max_guests int not null default 2 check (max_guests > 0),
  bedrooms int not null default 1,
  beds int not null default 1,
  bathrooms int not null default 1,
  area int,
  floors int,
  price_per_night int not null check (price_per_night > 0),
  old_price int,
  rating numeric(3, 1) not null default 0,
  reviews_count int not null default 0,
  featured boolean not null default false,
  popular boolean not null default false,
  status public.property_status not null default 'draft',
  rejection_reason text,
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create index idx_properties_status on public.properties (status);
create index idx_properties_owner on public.properties (owner_id);
create index idx_properties_location on public.properties (location);
create index idx_properties_shore on public.properties (shore);
create index idx_properties_price on public.properties (price_per_night);

create trigger trg_properties_touch before update on public.properties
  for each row execute function public.touch_updated_at();

-- ---------- PROPERTY IMAGES ----------
create table public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties (id) on delete cascade,
  url text not null,
  sort_order int not null default 0,
  is_cover boolean not null default false
);

create index idx_property_images_property on public.property_images (property_id);

-- ---------- PROPERTY AMENITIES ----------
create table public.property_amenities (
  property_id uuid not null references public.properties (id) on delete cascade,
  amenity_key text not null references public.amenities (key) on delete cascade,
  primary key (property_id, amenity_key)
);

-- ---------- AVAILABILITY ----------
create table public.property_availability (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties (id) on delete cascade,
  date date not null,
  status public.availability_status not null default 'blocked',
  booking_id uuid,
  unique (property_id, date)
);

create index idx_availability_property on public.property_availability (property_id, date);

-- ---------- BOOKINGS ----------
create sequence public.booking_number_seq start 10427;

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_number text not null unique,
  property_id uuid not null references public.properties (id) on delete restrict,
  owner_id uuid references public.owner_profiles (id) on delete set null,
  user_id uuid references public.profiles (id) on delete set null,
  guest_first_name text not null,
  guest_last_name text,
  guest_phone text not null,
  guest_email text,
  check_in date not null,
  check_out date not null,
  guests int not null check (guests > 0),
  price_per_night int not null,
  nights int not null check (nights > 0),
  total_price int not null,
  status public.booking_status not null default 'pending',
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (check_out > check_in)
);

create index idx_bookings_property on public.bookings (property_id);
create index idx_bookings_owner on public.bookings (owner_id);
create index idx_bookings_user on public.bookings (user_id);
create index idx_bookings_status on public.bookings (status);

create trigger trg_bookings_touch before update on public.bookings
  for each row execute function public.touch_updated_at();

-- ---------- FAVORITES ----------
create table public.favorites (
  user_id uuid not null references public.profiles (id) on delete cascade,
  property_id uuid not null references public.properties (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, property_id)
);

create index idx_favorites_user on public.favorites (user_id);

-- ---------- RECENTLY VIEWED ----------
create table public.recently_viewed (
  user_id uuid not null references public.profiles (id) on delete cascade,
  property_id uuid not null references public.properties (id) on delete cascade,
  viewed_at timestamptz not null default now(),
  primary key (user_id, property_id)
);

-- ---------- REVIEWS ----------
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete set null,
  booking_id uuid references public.bookings (id) on delete set null,
  author_name text,
  author_city text,
  rating int not null check (rating between 1 and 5),
  text text not null,
  status public.review_status not null default 'pending',
  created_at timestamptz not null default now()
);

create index idx_reviews_property on public.reviews (property_id);

-- ---------- NOTIFICATIONS ----------
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null,
  title text not null,
  message text not null default '',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_notifications_user on public.notifications (user_id, created_at desc);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Серверное создание заявки: цена считается ТОЛЬКО из БД
create or replace function public.create_booking(
  p_property_id uuid,
  p_check_in date,
  p_check_out date,
  p_guests int,
  p_first_name text,
  p_phone text,
  p_email text default null,
  p_comment text default null
)
returns jsonb
language plpgsql
security definer set search_path = public
as $$
declare
  v_property record;
  v_nights int;
  v_total int;
  v_number text;
  v_booking_id uuid;
  v_conflict int;
begin
  -- базовая валидация
  if p_first_name is null or length(trim(p_first_name)) < 2 then
    raise exception 'INVALID_NAME';
  end if;
  if p_phone is null or p_phone !~ '^\+?996\d{9}$' then
    raise exception 'INVALID_PHONE';
  end if;
  if p_check_in is null or p_check_out is null or p_check_out <= p_check_in then
    raise exception 'INVALID_DATES';
  end if;
  if p_check_in < current_date then
    raise exception 'DATES_IN_PAST';
  end if;
  if p_guests is null or p_guests < 1 then
    raise exception 'INVALID_GUESTS';
  end if;

  select * into v_property
  from public.properties
  where id = p_property_id and status = 'published';

  if not found then
    raise exception 'PROPERTY_NOT_FOUND';
  end if;

  if p_guests > v_property.max_guests then
    raise exception 'TOO_MANY_GUESTS';
  end if;

  -- защита от гонок на один объект
  perform pg_advisory_xact_lock(hashtext(p_property_id::text));

  -- проверка доступности дат
  select count(*) into v_conflict
  from public.property_availability
  where property_id = p_property_id
    and status in ('blocked', 'booked')
    and date >= p_check_in
    and date < p_check_out;

  if v_conflict > 0 then
    raise exception 'DATES_UNAVAILABLE';
  end if;

  select count(*) into v_conflict
  from public.bookings
  where property_id = p_property_id
    and status = 'confirmed'
    and check_in < p_check_out
    and check_out > p_check_in;

  if v_conflict > 0 then
    raise exception 'DATES_UNAVAILABLE';
  end if;

  v_nights := p_check_out - p_check_in;
  v_total := v_nights * v_property.price_per_night;
  v_number := 'IK-' || nextval('public.booking_number_seq');

  insert into public.bookings (
    booking_number, property_id, owner_id, user_id,
    guest_first_name, guest_phone, guest_email,
    check_in, check_out, guests,
    price_per_night, nights, total_price, comment
  ) values (
    v_number, p_property_id, v_property.owner_id, auth.uid(),
    trim(p_first_name), regexp_replace(p_phone, '[^0-9+]', '', 'g'), nullif(trim(coalesce(p_email, '')), ''),
    p_check_in, p_check_out, p_guests,
    v_property.price_per_night, v_nights, v_total, nullif(trim(coalesce(p_comment, '')), '')
  )
  returning id into v_booking_id;

  return jsonb_build_object(
    'id', v_booking_id,
    'booking_number', v_number,
    'nights', v_nights,
    'price_per_night', v_property.price_per_night,
    'total_price', v_total,
    'property_title', v_property.title
  );
end;
$$;

-- Подтверждение заявки владельцем/админом: блокирует даты, защита от double booking
create or replace function public.confirm_booking(p_booking_id uuid)
returns jsonb
language plpgsql
security definer set search_path = public
as $$
declare
  v_booking record;
  v_conflict int;
  v_day date;
begin
  select b.* into v_booking
  from public.bookings b
  where b.id = p_booking_id;

  if not found then
    raise exception 'BOOKING_NOT_FOUND';
  end if;

  -- только владелец объекта или админ
  if not (public.is_admin() or public.is_owner_user(v_booking.owner_id)) then
    raise exception 'FORBIDDEN';
  end if;

  if v_booking.status <> 'pending' then
    raise exception 'INVALID_STATUS';
  end if;

  perform pg_advisory_xact_lock(hashtext(v_booking.property_id::text));

  select count(*) into v_conflict
  from public.bookings
  where property_id = v_booking.property_id
    and status = 'confirmed'
    and id <> v_booking.id
    and check_in < v_booking.check_out
    and check_out > v_booking.check_in;

  if v_conflict > 0 then
    raise exception 'DATES_UNAVAILABLE';
  end if;

  update public.bookings set status = 'confirmed' where id = v_booking.id;

  v_day := v_booking.check_in;
  while v_day < v_booking.check_out loop
    insert into public.property_availability (property_id, date, status, booking_id)
    values (v_booking.property_id, v_day, 'booked', v_booking.id)
    on conflict (property_id, date)
      do update set status = 'booked', booking_id = v_booking.id;
    v_day := v_day + 1;
  end loop;

  return jsonb_build_object('ok', true, 'status', 'confirmed');
end;
$$;

-- Отклонение заявки
create or replace function public.decline_booking(p_booking_id uuid)
returns jsonb
language plpgsql
security definer set search_path = public
as $$
declare
  v_booking record;
begin
  select b.* into v_booking from public.bookings b where b.id = p_booking_id;
  if not found then
    raise exception 'BOOKING_NOT_FOUND';
  end if;
  if not (public.is_admin() or public.is_owner_user(v_booking.owner_id)) then
    raise exception 'FORBIDDEN';
  end if;
  if v_booking.status <> 'pending' then
    raise exception 'INVALID_STATUS';
  end if;
  update public.bookings set status = 'declined' where id = v_booking.id;
  return jsonb_build_object('ok', true, 'status', 'declined');
end;
$$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.owner_profiles enable row level security;
alter table public.amenities enable row level security;
alter table public.properties enable row level security;
alter table public.property_images enable row level security;
alter table public.property_amenities enable row level security;
alter table public.property_availability enable row level security;
alter table public.bookings enable row level security;
alter table public.favorites enable row level security;
alter table public.recently_viewed enable row level security;
alter table public.reviews enable row level security;
alter table public.notifications enable row level security;

-- profiles
create policy "profiles: read own" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy "profiles: update own" on public.profiles
  for update using (id = auth.uid() or public.is_admin())
  with check (
    (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()))
    or public.is_admin()
  );

-- owner_profiles
create policy "owner_profiles: read own or admin" on public.owner_profiles
  for select using (user_id = auth.uid() or public.is_admin());
-- публичная карточка владельца видна, если у него есть опубликованный объект
create policy "owner_profiles: public read for published" on public.owner_profiles
  for select using (
    exists (
      select 1 from public.properties p
      where p.owner_id = owner_profiles.id and p.status = 'published'
    )
  );
create policy "owner_profiles: insert own" on public.owner_profiles
  for insert with check (user_id = auth.uid());
create policy "owner_profiles: update own or admin" on public.owner_profiles
  for update using (user_id = auth.uid() or public.is_admin());

-- amenities: справочник, читается всеми
create policy "amenities: public read" on public.amenities
  for select using (true);

-- properties
create policy "properties: public read published" on public.properties
  for select using (
    status = 'published'
    or public.is_admin()
    or (owner_id is not null and public.is_owner_user(owner_id))
  );
create policy "properties: owner insert" on public.properties
  for insert with check (owner_id is not null and public.is_owner_user(owner_id));
create policy "properties: owner update" on public.properties
  for update using (
    public.is_admin() or (owner_id is not null and public.is_owner_user(owner_id))
  );

-- property_images / amenities / availability: видимы вместе с объектом
create policy "property_images: read" on public.property_images
  for select using (
    exists (
      select 1 from public.properties p
      where p.id = property_id
        and (p.status = 'published' or public.is_admin()
             or (p.owner_id is not null and public.is_owner_user(p.owner_id)))
    )
  );
create policy "property_images: owner write" on public.property_images
  for all using (
    exists (
      select 1 from public.properties p
      where p.id = property_id
        and (public.is_admin() or (p.owner_id is not null and public.is_owner_user(p.owner_id)))
    )
  );

create policy "property_amenities: read" on public.property_amenities
  for select using (
    exists (
      select 1 from public.properties p
      where p.id = property_id
        and (p.status = 'published' or public.is_admin()
             or (p.owner_id is not null and public.is_owner_user(p.owner_id)))
    )
  );
create policy "property_amenities: owner write" on public.property_amenities
  for all using (
    exists (
      select 1 from public.properties p
      where p.id = property_id
        and (public.is_admin() or (p.owner_id is not null and public.is_owner_user(p.owner_id)))
    )
  );

create policy "availability: read" on public.property_availability
  for select using (
    exists (
      select 1 from public.properties p
      where p.id = property_id
        and (p.status = 'published' or public.is_admin()
             or (p.owner_id is not null and public.is_owner_user(p.owner_id)))
    )
  );
create policy "availability: owner write" on public.property_availability
  for all using (
    exists (
      select 1 from public.properties p
      where p.id = property_id
        and (public.is_admin() or (p.owner_id is not null and public.is_owner_user(p.owner_id)))
    )
  );

-- bookings: гость видит свои, владелец — по своим объектам, админ — все
create policy "bookings: read own" on public.bookings
  for select using (
    user_id = auth.uid()
    or public.is_admin()
    or (owner_id is not null and public.is_owner_user(owner_id))
  );
-- вставка ТОЛЬКО через create_booking (security definer); прямой insert запрещён

-- favorites
create policy "favorites: manage own" on public.favorites
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- recently viewed
create policy "recently_viewed: manage own" on public.recently_viewed
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- reviews
create policy "reviews: public read published" on public.reviews
  for select using (status = 'published' or public.is_admin());

-- notifications
create policy "notifications: read own" on public.notifications
  for select using (user_id = auth.uid());
create policy "notifications: update own" on public.notifications
  for update using (user_id = auth.uid());

-- ============================================================
-- GRANTS для RPC
-- ============================================================
grant execute on function public.create_booking(uuid, date, date, int, text, text, text, text) to anon, authenticated;
grant execute on function public.confirm_booking(uuid) to authenticated;
grant execute on function public.decline_booking(uuid) to authenticated;

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

create policy "avatars: public read" on storage.objects
  for select using (bucket_id = 'avatars');
create policy "avatars: user upload own" on storage.objects
  for insert with check (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "avatars: user update own" on storage.objects
  for update using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "avatars: user delete own" on storage.objects
  for delete using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "property-images: public read" on storage.objects
  for select using (bucket_id = 'property-images');
create policy "property-images: owner upload" on storage.objects
  for insert with check (
    bucket_id = 'property-images' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "property-images: owner delete" on storage.objects
  for delete using (
    bucket_id = 'property-images' and (storage.foldername(name))[1] = auth.uid()::text
  );
