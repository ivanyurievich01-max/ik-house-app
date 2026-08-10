-- IK-HOUSE demo seed (сгенерировано из data/properties.ts)
-- Запускать ПОСЛЕ 0001_init.sql. Повторный запуск обновит объекты по slug.
begin;

-- Владелец: Азамат
insert into auth.users (instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, email_change,
  email_change_token_new, recovery_token)
select '00000000-0000-0000-0000-000000000000', '9ec3d87f-d016-4a81-9f71-5ecbf6923d0f', 'authenticated', 'authenticated',
  'demo.owner.1@ik-house.dev', crypt(gen_random_uuid()::text, gen_salt('bf')),
  now(), '{"provider":"email","providers":["email"]}',
  '{"first_name":"Азамат","last_name":"(Demo)"}'::jsonb,
  now(), now(), '', '', '', ''
where not exists (select 1 from auth.users where email = 'demo.owner.1@ik-house.dev');

insert into public.owner_profiles (id, user_id, owner_type, display_name, whatsapp,
  public_phone, avatar_url, show_public_contact, verification_status, reviewed_at)
select 'fce89887-1495-41c5-b056-2f3a46c8dbcc', u.id, 'individual', 'Азамат', '996555123456',
  '+996555123456', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=70', true, 'verified', now()
from auth.users u
where u.email = 'demo.owner.1@ik-house.dev'
on conflict (user_id) do nothing;

-- Владелец: Айгуль
insert into auth.users (instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, email_change,
  email_change_token_new, recovery_token)
select '00000000-0000-0000-0000-000000000000', '54c436db-17e8-4c15-8998-cbcede9db69e', 'authenticated', 'authenticated',
  'demo.owner.2@ik-house.dev', crypt(gen_random_uuid()::text, gen_salt('bf')),
  now(), '{"provider":"email","providers":["email"]}',
  '{"first_name":"Айгуль","last_name":"(Demo)"}'::jsonb,
  now(), now(), '', '', '', ''
where not exists (select 1 from auth.users where email = 'demo.owner.2@ik-house.dev');

insert into public.owner_profiles (id, user_id, owner_type, display_name, whatsapp,
  public_phone, avatar_url, show_public_contact, verification_status, reviewed_at)
select '4401c490-de7f-4e7e-9ab3-90da84069135', u.id, 'individual', 'Айгуль', '996700245118',
  '+996700245118', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=70', true, 'verified', now()
from auth.users u
where u.email = 'demo.owner.2@ik-house.dev'
on conflict (user_id) do nothing;

-- Владелец: Руслан
insert into auth.users (instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, email_change,
  email_change_token_new, recovery_token)
select '00000000-0000-0000-0000-000000000000', 'cef2ad12-de0c-4472-a856-f85e193d6f14', 'authenticated', 'authenticated',
  'demo.owner.3@ik-house.dev', crypt(gen_random_uuid()::text, gen_salt('bf')),
  now(), '{"provider":"email","providers":["email"]}',
  '{"first_name":"Руслан","last_name":"(Demo)"}'::jsonb,
  now(), now(), '', '', '', ''
where not exists (select 1 from auth.users where email = 'demo.owner.3@ik-house.dev');

insert into public.owner_profiles (id, user_id, owner_type, display_name, whatsapp,
  public_phone, avatar_url, show_public_contact, verification_status, reviewed_at)
select '6e754095-f816-431e-9587-1814cc398f46', u.id, 'individual', 'Руслан', '996555908771',
  '+996555908771', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=70', true, 'verified', now()
from auth.users u
where u.email = 'demo.owner.3@ik-house.dev'
on conflict (user_id) do nothing;

-- Владелец: Гульнара
insert into auth.users (instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, email_change,
  email_change_token_new, recovery_token)
select '00000000-0000-0000-0000-000000000000', '9b20ba31-8b6f-4cb9-8d84-2b59c914ba3f', 'authenticated', 'authenticated',
  'demo.owner.4@ik-house.dev', crypt(gen_random_uuid()::text, gen_salt('bf')),
  now(), '{"provider":"email","providers":["email"]}',
  '{"first_name":"Гульнара","last_name":"(Demo)"}'::jsonb,
  now(), now(), '', '', '', ''
where not exists (select 1 from auth.users where email = 'demo.owner.4@ik-house.dev');

insert into public.owner_profiles (id, user_id, owner_type, display_name, whatsapp,
  public_phone, avatar_url, show_public_contact, verification_status, reviewed_at)
select 'a25a5f57-bde9-424e-adb0-8357c89d9dd1', u.id, 'individual', 'Гульнара', '996770334902',
  '+996770334902', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=70', true, 'verified', now()
from auth.users u
where u.email = 'demo.owner.4@ik-house.dev'
on conflict (user_id) do nothing;

-- Владелец: Бекзат
insert into auth.users (instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, email_change,
  email_change_token_new, recovery_token)
select '00000000-0000-0000-0000-000000000000', '8aa0aebb-1c33-4810-9297-04227ae83f35', 'authenticated', 'authenticated',
  'demo.owner.5@ik-house.dev', crypt(gen_random_uuid()::text, gen_salt('bf')),
  now(), '{"provider":"email","providers":["email"]}',
  '{"first_name":"Бекзат","last_name":"(Demo)"}'::jsonb,
  now(), now(), '', '', '', ''
where not exists (select 1 from auth.users where email = 'demo.owner.5@ik-house.dev');

insert into public.owner_profiles (id, user_id, owner_type, display_name, whatsapp,
  public_phone, avatar_url, show_public_contact, verification_status, reviewed_at)
select 'f0a1f9c1-3173-4de1-954a-a6f39deeb536', u.id, 'individual', 'Бекзат', '996559112340',
  '+996559112340', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=70', true, 'verified', now()
from auth.users u
where u.email = 'demo.owner.5@ik-house.dev'
on conflict (user_id) do nothing;

-- Владелец: Нурлан
insert into auth.users (instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, email_change,
  email_change_token_new, recovery_token)
select '00000000-0000-0000-0000-000000000000', '293d2f01-2311-47d8-b3da-47c99919561a', 'authenticated', 'authenticated',
  'demo.owner.6@ik-house.dev', crypt(gen_random_uuid()::text, gen_salt('bf')),
  now(), '{"provider":"email","providers":["email"]}',
  '{"first_name":"Нурлан","last_name":"(Demo)"}'::jsonb,
  now(), now(), '', '', '', ''
where not exists (select 1 from auth.users where email = 'demo.owner.6@ik-house.dev');

insert into public.owner_profiles (id, user_id, owner_type, display_name, whatsapp,
  public_phone, avatar_url, show_public_contact, verification_status, reviewed_at)
select '7c1300b1-7732-433b-9062-b58d0c61421b', u.id, 'individual', 'Нурлан', '996501774220',
  '+996501774220', 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=1200&q=70', true, 'verified', now()
from auth.users u
where u.email = 'demo.owner.6@ik-house.dev'
on conflict (user_id) do nothing;

-- Объект: Коттедж «Лагуна»
insert into public.properties (id, owner_id, slug, title, type, description, shore,
  location, address, latitude, longitude, distance_to_beach, max_guests, bedrooms,
  beds, bathrooms, price_per_night, old_price, rating, reviews_count, featured,
  popular, status, published_at)
values ('f3e3a341-eed6-484f-a014-68d784960885',
  (select op.id from public.owner_profiles op join auth.users u on u.id = op.user_id
   where op.display_name = 'Азамат' limit 1),
  'kottedzh-laguna', 'Коттедж «Лагуна»', 'cottage', 'Современный коттедж в 200 метрах от берега озера Иссык-Куль. Полностью меблирован, оборудован кухней и Wi-Fi. Просторная терраса с видом на горы, мангальная зона и парковка во дворе. Пляж и рестораны — в шаговой доступности.', 'south',
  'Чолпон-Ата', 'Чолпон-Ата, Иссык-Куль', 42.6498, 77.0836,
  200, 8, 3, 4, 2,
  5500, 6500, 4.9, 37,
  true, true, 'published', now())
on conflict (slug) do update set
  title = excluded.title, description = excluded.description,
  price_per_night = excluded.price_per_night, status = 'published',
  published_at = coalesce(public.properties.published_at, now());

delete from public.property_images where property_id = (select id from public.properties where slug = 'kottedzh-laguna');
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'kottedzh-laguna'), 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=70', 0, true);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'kottedzh-laguna'), 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=70', 1, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'kottedzh-laguna'), 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=70', 2, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'kottedzh-laguna'), 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=70', 3, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'kottedzh-laguna'), 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=70', 4, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'kottedzh-laguna'), 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=70', 5, false);
delete from public.property_amenities where property_id = (select id from public.properties where slug = 'kottedzh-laguna');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'kottedzh-laguna'), 'wifi');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'kottedzh-laguna'), 'parking');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'kottedzh-laguna'), 'kitchen');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'kottedzh-laguna'), 'shower');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'kottedzh-laguna'), 'beach');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'kottedzh-laguna'), 'terrace');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'kottedzh-laguna'), 'tv');
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'kottedzh-laguna'), '2026-08-17', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'kottedzh-laguna'), '2026-08-18', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'kottedzh-laguna'), '2026-08-19', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'kottedzh-laguna'), '2026-08-30', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'kottedzh-laguna'), '2026-08-31', 'blocked') on conflict (property_id, date) do nothing;
delete from public.reviews where user_id is null and property_id = (select id from public.properties where slug = 'kottedzh-laguna');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'kottedzh-laguna'), 'Анна', 'Алматы', 5, 'Быстро нашли хороший дом в Чолпон-Ате. Фотографии полностью соответствовали реальности, хозяин оперативно подтвердил бронь. Приедем ещё.', 'published', '2025-07-18T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'kottedzh-laguna'), 'Дмитрий', 'Бишкек', 5, 'Чисто, уютно, до пляжа пешком пару минут. Отличное место для семейного отдыха, дети были в восторге от озера.', 'published', '2025-08-02T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'kottedzh-laguna'), 'Асель', 'Астана', 4, 'Всё понравилось, кухня оборудована, Wi-Fi работал стабильно. Немного шумновато вечером, но в целом рекомендую.', 'published', '2025-07-05T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'kottedzh-laguna'), 'Максим', 'Караганда', 5, 'Просторно, есть мангал и терраса с видом. Хозяин встретил, всё показал. Уезжать не хотелось.', 'published', '2025-06-28T12:00:00Z');

-- Объект: Коттедж у озера
insert into public.properties (id, owner_id, slug, title, type, description, shore,
  location, address, latitude, longitude, distance_to_beach, max_guests, bedrooms,
  beds, bathrooms, price_per_night, old_price, rating, reviews_count, featured,
  popular, status, published_at)
values ('0ae84409-f33f-4a34-b44c-c1816aabbf83',
  (select op.id from public.owner_profiles op join auth.users u on u.id = op.user_id
   where op.display_name = 'Айгуль' limit 1),
  'kottedzh-u-ozera', 'Коттедж у озера', 'cottage', 'Уютный дом всего в 80 метрах от воды. Идеально для семьи: тихий двор, зелёная лужайка, зона барбекю. До собственного участка пляжа — минута пешком.', 'south',
  'Чолпон-Ата', 'Чолпон-Ата, Иссык-Куль', 42.6512, 77.0721,
  80, 6, 2, 3, 1,
  6000, null, 4.9, 52,
  true, true, 'published', now())
on conflict (slug) do update set
  title = excluded.title, description = excluded.description,
  price_per_night = excluded.price_per_night, status = 'published',
  published_at = coalesce(public.properties.published_at, now());

delete from public.property_images where property_id = (select id from public.properties where slug = 'kottedzh-u-ozera');
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'kottedzh-u-ozera'), 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=70', 0, true);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'kottedzh-u-ozera'), 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=70', 1, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'kottedzh-u-ozera'), 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=70', 2, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'kottedzh-u-ozera'), 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=70', 3, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'kottedzh-u-ozera'), 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=70', 4, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'kottedzh-u-ozera'), 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=70', 5, false);
delete from public.property_amenities where property_id = (select id from public.properties where slug = 'kottedzh-u-ozera');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'kottedzh-u-ozera'), 'wifi');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'kottedzh-u-ozera'), 'kitchen');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'kottedzh-u-ozera'), 'beach');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'kottedzh-u-ozera'), 'parking');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'kottedzh-u-ozera'), 'bbq');
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'kottedzh-u-ozera'), '2026-08-18', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'kottedzh-u-ozera'), '2026-08-19', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'kottedzh-u-ozera'), '2026-08-20', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'kottedzh-u-ozera'), '2026-08-31', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'kottedzh-u-ozera'), '2026-09-01', 'blocked') on conflict (property_id, date) do nothing;
delete from public.reviews where user_id is null and property_id = (select id from public.properties where slug = 'kottedzh-u-ozera');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'kottedzh-u-ozera'), 'Дмитрий', 'Бишкек', 5, 'Чисто, уютно, до пляжа пешком пару минут. Отличное место для семейного отдыха, дети были в восторге от озера.', 'published', '2025-08-02T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'kottedzh-u-ozera'), 'Асель', 'Астана', 4, 'Всё понравилось, кухня оборудована, Wi-Fi работал стабильно. Немного шумновато вечером, но в целом рекомендую.', 'published', '2025-07-05T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'kottedzh-u-ozera'), 'Максим', 'Караганда', 5, 'Просторно, есть мангал и терраса с видом. Хозяин встретил, всё показал. Уезжать не хотелось.', 'published', '2025-06-28T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'kottedzh-u-ozera'), 'Жанна', 'Ош', 5, 'Идеально для компании друзей. Большой двор, парковка, рядом магазины. Спасибо за приём!', 'published', '2025-08-11T12:00:00Z');

-- Объект: Коттедж «Mountain View»
insert into public.properties (id, owner_id, slug, title, type, description, shore,
  location, address, latitude, longitude, distance_to_beach, max_guests, bedrooms,
  beds, bathrooms, price_per_night, old_price, rating, reviews_count, featured,
  popular, status, published_at)
values ('b753286d-087f-48cf-840f-589c5eaa4d74',
  (select op.id from public.owner_profiles op join auth.users u on u.id = op.user_id
   where op.display_name = 'Руслан' limit 1),
  'mountain-view', 'Коттедж «Mountain View»', 'cottage', 'Дом с панорамным видом на хребет Кунгей-Ала-Тоо. Большие окна, светлые комнаты, терраса для вечернего чая. Отличная база, чтобы исследовать северный и южный берег.', 'south',
  'Кара-Ой', 'Кара-Ой, Иссык-Куль', 42.6301, 76.9902,
  150, 7, 3, 4, 2,
  5500, null, 4.7, 29,
  false, true, 'published', now())
on conflict (slug) do update set
  title = excluded.title, description = excluded.description,
  price_per_night = excluded.price_per_night, status = 'published',
  published_at = coalesce(public.properties.published_at, now());

delete from public.property_images where property_id = (select id from public.properties where slug = 'mountain-view');
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'mountain-view'), 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=70', 0, true);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'mountain-view'), 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=70', 1, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'mountain-view'), 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=70', 2, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'mountain-view'), 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1200&q=70', 3, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'mountain-view'), 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=70', 4, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'mountain-view'), 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=70', 5, false);
delete from public.property_amenities where property_id = (select id from public.properties where slug = 'mountain-view');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'mountain-view'), 'wifi');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'mountain-view'), 'parking');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'mountain-view'), 'kitchen');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'mountain-view'), 'ac');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'mountain-view'), 'terrace');
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'mountain-view'), '2026-08-19', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'mountain-view'), '2026-08-20', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'mountain-view'), '2026-08-21', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'mountain-view'), '2026-09-01', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'mountain-view'), '2026-09-02', 'blocked') on conflict (property_id, date) do nothing;
delete from public.reviews where user_id is null and property_id = (select id from public.properties where slug = 'mountain-view');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'mountain-view'), 'Асель', 'Астана', 4, 'Всё понравилось, кухня оборудована, Wi-Fi работал стабильно. Немного шумновато вечером, но в целом рекомендую.', 'published', '2025-07-05T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'mountain-view'), 'Максим', 'Караганда', 5, 'Просторно, есть мангал и терраса с видом. Хозяин встретил, всё показал. Уезжать не хотелось.', 'published', '2025-06-28T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'mountain-view'), 'Жанна', 'Ош', 5, 'Идеально для компании друзей. Большой двор, парковка, рядом магазины. Спасибо за приём!', 'published', '2025-08-11T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'mountain-view'), 'Игорь', 'Бишкек', 4, 'Хорошее соотношение цены и качества. Вода в озере тёплая, пляж рядом. Кондиционер спасал в жару.', 'published', '2025-07-22T12:00:00Z');

-- Объект: Гостевой дом «Ак-Булак»
insert into public.properties (id, owner_id, slug, title, type, description, shore,
  location, address, latitude, longitude, distance_to_beach, max_guests, bedrooms,
  beds, bathrooms, price_per_night, old_price, rating, reviews_count, featured,
  popular, status, published_at)
values ('586e367c-9b7d-45f6-9891-91e8a906acb9',
  (select op.id from public.owner_profiles op join auth.users u on u.id = op.user_id
   where op.display_name = 'Гульнара' limit 1),
  'gostevoy-dom-ak-bulak', 'Гостевой дом «Ак-Булак»', 'guesthouse', 'Семейный гостевой дом в Бостери с домашней кухней и завтраком. Хозяева живут рядом и всегда подскажут лучшие места. Уютные номера, общая кухня и большой двор.', 'north',
  'Бостери', 'Бостери, Иссык-Куль', 42.6603, 77.1512,
  200, 8, 3, 5, 2,
  4500, null, 4.8, 64,
  true, true, 'published', now())
on conflict (slug) do update set
  title = excluded.title, description = excluded.description,
  price_per_night = excluded.price_per_night, status = 'published',
  published_at = coalesce(public.properties.published_at, now());

delete from public.property_images where property_id = (select id from public.properties where slug = 'gostevoy-dom-ak-bulak');
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'gostevoy-dom-ak-bulak'), 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=70', 0, true);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'gostevoy-dom-ak-bulak'), 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=70', 1, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'gostevoy-dom-ak-bulak'), 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=70', 2, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'gostevoy-dom-ak-bulak'), 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=70', 3, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'gostevoy-dom-ak-bulak'), 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=70', 4, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'gostevoy-dom-ak-bulak'), 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=70', 5, false);
delete from public.property_amenities where property_id = (select id from public.properties where slug = 'gostevoy-dom-ak-bulak');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'gostevoy-dom-ak-bulak'), 'wifi');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'gostevoy-dom-ak-bulak'), 'parking');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'gostevoy-dom-ak-bulak'), 'kitchen');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'gostevoy-dom-ak-bulak'), 'breakfast');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'gostevoy-dom-ak-bulak'), 'bbq');
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'gostevoy-dom-ak-bulak'), '2026-08-20', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'gostevoy-dom-ak-bulak'), '2026-08-21', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'gostevoy-dom-ak-bulak'), '2026-08-22', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'gostevoy-dom-ak-bulak'), '2026-09-02', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'gostevoy-dom-ak-bulak'), '2026-09-03', 'blocked') on conflict (property_id, date) do nothing;
delete from public.reviews where user_id is null and property_id = (select id from public.properties where slug = 'gostevoy-dom-ak-bulak');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'gostevoy-dom-ak-bulak'), 'Максим', 'Караганда', 5, 'Просторно, есть мангал и терраса с видом. Хозяин встретил, всё показал. Уезжать не хотелось.', 'published', '2025-06-28T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'gostevoy-dom-ak-bulak'), 'Жанна', 'Ош', 5, 'Идеально для компании друзей. Большой двор, парковка, рядом магазины. Спасибо за приём!', 'published', '2025-08-11T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'gostevoy-dom-ak-bulak'), 'Игорь', 'Бишкек', 4, 'Хорошее соотношение цены и качества. Вода в озере тёплая, пляж рядом. Кондиционер спасал в жару.', 'published', '2025-07-22T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'gostevoy-dom-ak-bulak'), 'Салтанат', 'Алматы', 5, 'Очень тихое и красивое место. Утром вид на горы, вечером закат над озером. Всё как на фото.', 'published', '2025-06-15T12:00:00Z');

-- Объект: Гостевой дом «Дельфин»
insert into public.properties (id, owner_id, slug, title, type, description, shore,
  location, address, latitude, longitude, distance_to_beach, max_guests, bedrooms,
  beds, bathrooms, price_per_night, old_price, rating, reviews_count, featured,
  popular, status, published_at)
values ('8e4e12b5-a11a-4571-bb25-cac0c2554e2f',
  (select op.id from public.owner_profiles op join auth.users u on u.id = op.user_id
   where op.display_name = 'Бекзат' limit 1),
  'gostevoy-dom-delfin', 'Гостевой дом «Дельфин»', 'guesthouse', 'Просторный гостевой дом для большой компании. Есть небольшой бассейн, зона отдыха и парковка на несколько машин. Подходит для корпоративов и семейных праздников.', 'south',
  'Тамчы', 'Тамчы, Иссык-Куль', 42.5701, 76.7112,
  300, 10, 4, 6, 3,
  7000, null, 4.6, 41,
  false, true, 'published', now())
on conflict (slug) do update set
  title = excluded.title, description = excluded.description,
  price_per_night = excluded.price_per_night, status = 'published',
  published_at = coalesce(public.properties.published_at, now());

delete from public.property_images where property_id = (select id from public.properties where slug = 'gostevoy-dom-delfin');
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'gostevoy-dom-delfin'), 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=70', 0, true);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'gostevoy-dom-delfin'), 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=70', 1, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'gostevoy-dom-delfin'), 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=70', 2, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'gostevoy-dom-delfin'), 'https://images.unsplash.com/photo-1518732714860-b62714ce0c59?auto=format&fit=crop&w=1200&q=70', 3, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'gostevoy-dom-delfin'), 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=70', 4, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'gostevoy-dom-delfin'), 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=70', 5, false);
delete from public.property_amenities where property_id = (select id from public.properties where slug = 'gostevoy-dom-delfin');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'gostevoy-dom-delfin'), 'wifi');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'gostevoy-dom-delfin'), 'parking');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'gostevoy-dom-delfin'), 'kitchen');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'gostevoy-dom-delfin'), 'ac');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'gostevoy-dom-delfin'), 'pool');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'gostevoy-dom-delfin'), 'breakfast');
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'gostevoy-dom-delfin'), '2026-08-21', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'gostevoy-dom-delfin'), '2026-08-22', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'gostevoy-dom-delfin'), '2026-08-23', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'gostevoy-dom-delfin'), '2026-08-30', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'gostevoy-dom-delfin'), '2026-08-31', 'blocked') on conflict (property_id, date) do nothing;
delete from public.reviews where user_id is null and property_id = (select id from public.properties where slug = 'gostevoy-dom-delfin');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'gostevoy-dom-delfin'), 'Жанна', 'Ош', 5, 'Идеально для компании друзей. Большой двор, парковка, рядом магазины. Спасибо за приём!', 'published', '2025-08-11T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'gostevoy-dom-delfin'), 'Игорь', 'Бишкек', 4, 'Хорошее соотношение цены и качества. Вода в озере тёплая, пляж рядом. Кондиционер спасал в жару.', 'published', '2025-07-22T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'gostevoy-dom-delfin'), 'Салтанат', 'Алматы', 5, 'Очень тихое и красивое место. Утром вид на горы, вечером закат над озером. Всё как на фото.', 'published', '2025-06-15T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'gostevoy-dom-delfin'), 'Тимур', 'Тараз', 5, 'Забронировали за минуту через WhatsApp, подтвердили сразу. Внутри свежий ремонт, всё новое.', 'published', '2025-08-06T12:00:00Z');

-- Объект: Уютный коттедж
insert into public.properties (id, owner_id, slug, title, type, description, shore,
  location, address, latitude, longitude, distance_to_beach, max_guests, bedrooms,
  beds, bathrooms, price_per_night, old_price, rating, reviews_count, featured,
  popular, status, published_at)
values ('705b286c-da6c-4bf3-bcce-787437087577',
  (select op.id from public.owner_profiles op join auth.users u on u.id = op.user_id
   where op.display_name = 'Нурлан' limit 1),
  'uyutnyy-kottedzh', 'Уютный коттедж', 'cottage', 'Компактный и аккуратный дом по доступной цене. Всё необходимое для комфортного отдыха: кухня, Wi-Fi, парковка. Хороший вариант для пары или небольшой семьи.', 'south',
  'Чолпон-Ата', 'Чолпон-Ата, Иссык-Куль', 42.6489, 77.0655,
  120, 5, 2, 3, 1,
  3000, null, 4.5, 23,
  false, false, 'published', now())
on conflict (slug) do update set
  title = excluded.title, description = excluded.description,
  price_per_night = excluded.price_per_night, status = 'published',
  published_at = coalesce(public.properties.published_at, now());

delete from public.property_images where property_id = (select id from public.properties where slug = 'uyutnyy-kottedzh');
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'uyutnyy-kottedzh'), 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=70', 0, true);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'uyutnyy-kottedzh'), 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=70', 1, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'uyutnyy-kottedzh'), 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=70', 2, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'uyutnyy-kottedzh'), 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=70', 3, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'uyutnyy-kottedzh'), 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=70', 4, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'uyutnyy-kottedzh'), 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=70', 5, false);
delete from public.property_amenities where property_id = (select id from public.properties where slug = 'uyutnyy-kottedzh');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'uyutnyy-kottedzh'), 'wifi');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'uyutnyy-kottedzh'), 'kitchen');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'uyutnyy-kottedzh'), 'parking');
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'uyutnyy-kottedzh'), '2026-08-17', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'uyutnyy-kottedzh'), '2026-08-18', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'uyutnyy-kottedzh'), '2026-08-19', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'uyutnyy-kottedzh'), '2026-08-31', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'uyutnyy-kottedzh'), '2026-09-01', 'blocked') on conflict (property_id, date) do nothing;
delete from public.reviews where user_id is null and property_id = (select id from public.properties where slug = 'uyutnyy-kottedzh');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'uyutnyy-kottedzh'), 'Игорь', 'Бишкек', 4, 'Хорошее соотношение цены и качества. Вода в озере тёплая, пляж рядом. Кондиционер спасал в жару.', 'published', '2025-07-22T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'uyutnyy-kottedzh'), 'Салтанат', 'Алматы', 5, 'Очень тихое и красивое место. Утром вид на горы, вечером закат над озером. Всё как на фото.', 'published', '2025-06-15T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'uyutnyy-kottedzh'), 'Тимур', 'Тараз', 5, 'Забронировали за минуту через WhatsApp, подтвердили сразу. Внутри свежий ремонт, всё новое.', 'published', '2025-08-06T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'uyutnyy-kottedzh'), 'Анна', 'Алматы', 5, 'Быстро нашли хороший дом в Чолпон-Ате. Фотографии полностью соответствовали реальности, хозяин оперативно подтвердил бронь. Приедем ещё.', 'published', '2025-07-18T12:00:00Z');

-- Объект: Вилла «Sunset»
insert into public.properties (id, owner_id, slug, title, type, description, shore,
  location, address, latitude, longitude, distance_to_beach, max_guests, bedrooms,
  beds, bathrooms, price_per_night, old_price, rating, reviews_count, featured,
  popular, status, published_at)
values ('1ceaf6c6-6ddf-4358-80e7-946d9acfa420',
  (select op.id from public.owner_profiles op join auth.users u on u.id = op.user_id
   where op.display_name = 'Азамат' limit 1),
  'villa-sunset', 'Вилла «Sunset»', 'villa', 'Премиальная вилла с собственным бассейном и панорамной террасой. Дизайнерский интерьер, пять спален, зона барбекю и лаунж у воды. Лучший выбор для незабываемого отдыха.', 'north',
  'Бостери', 'Бостери, Иссык-Куль', 42.6631, 77.1588,
  180, 12, 5, 7, 4,
  12000, 14000, 4.9, 88,
  true, true, 'published', now())
on conflict (slug) do update set
  title = excluded.title, description = excluded.description,
  price_per_night = excluded.price_per_night, status = 'published',
  published_at = coalesce(public.properties.published_at, now());

delete from public.property_images where property_id = (select id from public.properties where slug = 'villa-sunset');
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'villa-sunset'), 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1200&q=70', 0, true);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'villa-sunset'), 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=70', 1, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'villa-sunset'), 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=70', 2, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'villa-sunset'), 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=70', 3, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'villa-sunset'), 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=70', 4, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'villa-sunset'), 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=70', 5, false);
delete from public.property_amenities where property_id = (select id from public.properties where slug = 'villa-sunset');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'villa-sunset'), 'wifi');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'villa-sunset'), 'parking');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'villa-sunset'), 'kitchen');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'villa-sunset'), 'ac');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'villa-sunset'), 'pool');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'villa-sunset'), 'bbq');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'villa-sunset'), 'terrace');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'villa-sunset'), 'tv');
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'villa-sunset'), '2026-08-18', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'villa-sunset'), '2026-08-19', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'villa-sunset'), '2026-08-20', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'villa-sunset'), '2026-09-01', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'villa-sunset'), '2026-09-02', 'blocked') on conflict (property_id, date) do nothing;
delete from public.reviews where user_id is null and property_id = (select id from public.properties where slug = 'villa-sunset');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'villa-sunset'), 'Салтанат', 'Алматы', 5, 'Очень тихое и красивое место. Утром вид на горы, вечером закат над озером. Всё как на фото.', 'published', '2025-06-15T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'villa-sunset'), 'Тимур', 'Тараз', 5, 'Забронировали за минуту через WhatsApp, подтвердили сразу. Внутри свежий ремонт, всё новое.', 'published', '2025-08-06T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'villa-sunset'), 'Анна', 'Алматы', 5, 'Быстро нашли хороший дом в Чолпон-Ате. Фотографии полностью соответствовали реальности, хозяин оперативно подтвердил бронь. Приедем ещё.', 'published', '2025-07-18T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'villa-sunset'), 'Дмитрий', 'Бишкек', 5, 'Чисто, уютно, до пляжа пешком пару минут. Отличное место для семейного отдыха, дети были в восторге от озера.', 'published', '2025-08-02T12:00:00Z');

-- Объект: Пансионат «Aurora»
insert into public.properties (id, owner_id, slug, title, type, description, shore,
  location, address, latitude, longitude, distance_to_beach, max_guests, bedrooms,
  beds, bathrooms, price_per_night, old_price, rating, reviews_count, featured,
  popular, status, published_at)
values ('493e3c73-2f70-4609-ad20-2768e195826b',
  (select op.id from public.owner_profiles op join auth.users u on u.id = op.user_id
   where op.display_name = 'Айгуль' limit 1),
  'pansionat-aurora', 'Пансионат «Aurora»', 'resort', 'Большой комплекс с ухоженной территорией, бассейном и трёхразовым питанием. Номера с балконами, детская площадка, собственный выход к пляжу. Всё включено для спокойного отдыха.', 'south',
  'Чолпон-Ата', 'Чолпон-Ата, Иссык-Куль', 42.6521, 77.0801,
  150, 4, 2, 2, 1,
  6000, null, 4.8, 210,
  true, true, 'published', now())
on conflict (slug) do update set
  title = excluded.title, description = excluded.description,
  price_per_night = excluded.price_per_night, status = 'published',
  published_at = coalesce(public.properties.published_at, now());

delete from public.property_images where property_id = (select id from public.properties where slug = 'pansionat-aurora');
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-aurora'), 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=70', 0, true);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-aurora'), 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=70', 1, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-aurora'), 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=70', 2, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-aurora'), 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1200&q=70', 3, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-aurora'), 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=70', 4, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-aurora'), 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=70', 5, false);
delete from public.property_amenities where property_id = (select id from public.properties where slug = 'pansionat-aurora');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'pansionat-aurora'), 'wifi');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'pansionat-aurora'), 'pool');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'pansionat-aurora'), 'beach');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'pansionat-aurora'), 'breakfast');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'pansionat-aurora'), 'parking');
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'pansionat-aurora'), '2026-08-19', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'pansionat-aurora'), '2026-08-20', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'pansionat-aurora'), '2026-08-21', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'pansionat-aurora'), '2026-09-02', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'pansionat-aurora'), '2026-09-03', 'blocked') on conflict (property_id, date) do nothing;
delete from public.reviews where user_id is null and property_id = (select id from public.properties where slug = 'pansionat-aurora');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'pansionat-aurora'), 'Тимур', 'Тараз', 5, 'Забронировали за минуту через WhatsApp, подтвердили сразу. Внутри свежий ремонт, всё новое.', 'published', '2025-08-06T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'pansionat-aurora'), 'Анна', 'Алматы', 5, 'Быстро нашли хороший дом в Чолпон-Ате. Фотографии полностью соответствовали реальности, хозяин оперативно подтвердил бронь. Приедем ещё.', 'published', '2025-07-18T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'pansionat-aurora'), 'Дмитрий', 'Бишкек', 5, 'Чисто, уютно, до пляжа пешком пару минут. Отличное место для семейного отдыха, дети были в восторге от озера.', 'published', '2025-08-02T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'pansionat-aurora'), 'Асель', 'Астана', 4, 'Всё понравилось, кухня оборудована, Wi-Fi работал стабильно. Немного шумновато вечером, но в целом рекомендую.', 'published', '2025-07-05T12:00:00Z');

-- Объект: Пансионат «Алтын-Кум»
insert into public.properties (id, owner_id, slug, title, type, description, shore,
  location, address, latitude, longitude, distance_to_beach, max_guests, bedrooms,
  beds, bathrooms, price_per_night, old_price, rating, reviews_count, featured,
  popular, status, published_at)
values ('50b5ba28-d234-43fb-8fde-2b4c0d3c61ba',
  (select op.id from public.owner_profiles op join auth.users u on u.id = op.user_id
   where op.display_name = 'Руслан' limit 1),
  'pansionat-altyn-kum', 'Пансионат «Алтын-Кум»', 'resort', 'Классический пансионат на северном берегу. Большая зелёная территория, два бассейна, питание и анимация для детей. До золотистого песчаного пляжа — 200 метров.', 'north',
  'Бостери', 'Бостери, Иссык-Куль', 42.6659, 77.1601,
  200, 4, 2, 2, 1,
  5500, null, 4.6, 156,
  false, true, 'published', now())
on conflict (slug) do update set
  title = excluded.title, description = excluded.description,
  price_per_night = excluded.price_per_night, status = 'published',
  published_at = coalesce(public.properties.published_at, now());

delete from public.property_images where property_id = (select id from public.properties where slug = 'pansionat-altyn-kum');
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-altyn-kum'), 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=70', 0, true);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-altyn-kum'), 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=70', 1, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-altyn-kum'), 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=70', 2, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-altyn-kum'), 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=70', 3, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-altyn-kum'), 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=70', 4, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-altyn-kum'), 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=70', 5, false);
delete from public.property_amenities where property_id = (select id from public.properties where slug = 'pansionat-altyn-kum');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'pansionat-altyn-kum'), 'wifi');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'pansionat-altyn-kum'), 'pool');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'pansionat-altyn-kum'), 'beach');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'pansionat-altyn-kum'), 'breakfast');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'pansionat-altyn-kum'), 'parking');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'pansionat-altyn-kum'), 'ac');
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'pansionat-altyn-kum'), '2026-08-20', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'pansionat-altyn-kum'), '2026-08-21', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'pansionat-altyn-kum'), '2026-08-22', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'pansionat-altyn-kum'), '2026-08-30', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'pansionat-altyn-kum'), '2026-08-31', 'blocked') on conflict (property_id, date) do nothing;
delete from public.reviews where user_id is null and property_id = (select id from public.properties where slug = 'pansionat-altyn-kum');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'pansionat-altyn-kum'), 'Анна', 'Алматы', 5, 'Быстро нашли хороший дом в Чолпон-Ате. Фотографии полностью соответствовали реальности, хозяин оперативно подтвердил бронь. Приедем ещё.', 'published', '2025-07-18T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'pansionat-altyn-kum'), 'Дмитрий', 'Бишкек', 5, 'Чисто, уютно, до пляжа пешком пару минут. Отличное место для семейного отдыха, дети были в восторге от озера.', 'published', '2025-08-02T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'pansionat-altyn-kum'), 'Асель', 'Астана', 4, 'Всё понравилось, кухня оборудована, Wi-Fi работал стабильно. Немного шумновато вечером, но в целом рекомендую.', 'published', '2025-07-05T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'pansionat-altyn-kum'), 'Максим', 'Караганда', 5, 'Просторно, есть мангал и терраса с видом. Хозяин встретил, всё показал. Уезжать не хотелось.', 'published', '2025-06-28T12:00:00Z');

-- Объект: Пансионат «Каприз»
insert into public.properties (id, owner_id, slug, title, type, description, shore,
  location, address, latitude, longitude, distance_to_beach, max_guests, bedrooms,
  beds, bathrooms, price_per_night, old_price, rating, reviews_count, featured,
  popular, status, published_at)
values ('adc64a47-40af-4c25-88fb-fd0e4b6bdfac',
  (select op.id from public.owner_profiles op join auth.users u on u.id = op.user_id
   where op.display_name = 'Гульнара' limit 1),
  'pansionat-kapriz', 'Пансионат «Каприз»', 'resort', 'Уютный пансионат в самом центре Чолпон-Аты, в сотне метров от воды. Бассейн, кафе, вечерние мероприятия. Удобно добираться до аквапарка и рынка.', 'south',
  'Чолпон-Ата', 'Чолпон-Ата, Иссык-Куль', 42.6505, 77.0777,
  100, 3, 1, 2, 1,
  4500, null, 4.7, 132,
  false, false, 'published', now())
on conflict (slug) do update set
  title = excluded.title, description = excluded.description,
  price_per_night = excluded.price_per_night, status = 'published',
  published_at = coalesce(public.properties.published_at, now());

delete from public.property_images where property_id = (select id from public.properties where slug = 'pansionat-kapriz');
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-kapriz'), 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=70', 0, true);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-kapriz'), 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=70', 1, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-kapriz'), 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=70', 2, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-kapriz'), 'https://images.unsplash.com/photo-1518732714860-b62714ce0c59?auto=format&fit=crop&w=1200&q=70', 3, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-kapriz'), 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=70', 4, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-kapriz'), 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=70', 5, false);
delete from public.property_amenities where property_id = (select id from public.properties where slug = 'pansionat-kapriz');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'pansionat-kapriz'), 'wifi');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'pansionat-kapriz'), 'pool');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'pansionat-kapriz'), 'beach');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'pansionat-kapriz'), 'breakfast');
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'pansionat-kapriz'), '2026-08-21', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'pansionat-kapriz'), '2026-08-22', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'pansionat-kapriz'), '2026-08-23', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'pansionat-kapriz'), '2026-08-31', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'pansionat-kapriz'), '2026-09-01', 'blocked') on conflict (property_id, date) do nothing;
delete from public.reviews where user_id is null and property_id = (select id from public.properties where slug = 'pansionat-kapriz');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'pansionat-kapriz'), 'Дмитрий', 'Бишкек', 5, 'Чисто, уютно, до пляжа пешком пару минут. Отличное место для семейного отдыха, дети были в восторге от озера.', 'published', '2025-08-02T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'pansionat-kapriz'), 'Асель', 'Астана', 4, 'Всё понравилось, кухня оборудована, Wi-Fi работал стабильно. Немного шумновато вечером, но в целом рекомендую.', 'published', '2025-07-05T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'pansionat-kapriz'), 'Максим', 'Караганда', 5, 'Просторно, есть мангал и терраса с видом. Хозяин встретил, всё показал. Уезжать не хотелось.', 'published', '2025-06-28T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'pansionat-kapriz'), 'Жанна', 'Ош', 5, 'Идеально для компании друзей. Большой двор, парковка, рядом магазины. Спасибо за приём!', 'published', '2025-08-11T12:00:00Z');

-- Объект: Пансионат «Эдельвейс»
insert into public.properties (id, owner_id, slug, title, type, description, shore,
  location, address, latitude, longitude, distance_to_beach, max_guests, bedrooms,
  beds, bathrooms, price_per_night, old_price, rating, reviews_count, featured,
  popular, status, published_at)
values ('3b836d9b-8ea3-4b3d-bab6-386a29b03afb',
  (select op.id from public.owner_profiles op join auth.users u on u.id = op.user_id
   where op.display_name = 'Бекзат' limit 1),
  'pansionat-edelveys', 'Пансионат «Эдельвейс»', 'resort', 'Тихий пансионат с большим садом и розарием. Спокойная атмосфера, бассейн и завтраки. Отличный выбор для тех, кто ценит уединённый отдых.', 'south',
  'Чолпон-Ата', 'Чолпон-Ата, Иссык-Куль', 42.6478, 77.0699,
  250, 4, 2, 3, 1,
  4000, null, 4.5, 98,
  false, false, 'published', now())
on conflict (slug) do update set
  title = excluded.title, description = excluded.description,
  price_per_night = excluded.price_per_night, status = 'published',
  published_at = coalesce(public.properties.published_at, now());

delete from public.property_images where property_id = (select id from public.properties where slug = 'pansionat-edelveys');
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-edelveys'), 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=70', 0, true);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-edelveys'), 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=70', 1, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-edelveys'), 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=70', 2, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-edelveys'), 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=70', 3, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-edelveys'), 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=70', 4, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-edelveys'), 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=70', 5, false);
delete from public.property_amenities where property_id = (select id from public.properties where slug = 'pansionat-edelveys');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'pansionat-edelveys'), 'wifi');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'pansionat-edelveys'), 'pool');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'pansionat-edelveys'), 'breakfast');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'pansionat-edelveys'), 'parking');
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'pansionat-edelveys'), '2026-08-17', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'pansionat-edelveys'), '2026-08-18', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'pansionat-edelveys'), '2026-08-19', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'pansionat-edelveys'), '2026-09-01', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'pansionat-edelveys'), '2026-09-02', 'blocked') on conflict (property_id, date) do nothing;
delete from public.reviews where user_id is null and property_id = (select id from public.properties where slug = 'pansionat-edelveys');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'pansionat-edelveys'), 'Асель', 'Астана', 4, 'Всё понравилось, кухня оборудована, Wi-Fi работал стабильно. Немного шумновато вечером, но в целом рекомендую.', 'published', '2025-07-05T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'pansionat-edelveys'), 'Максим', 'Караганда', 5, 'Просторно, есть мангал и терраса с видом. Хозяин встретил, всё показал. Уезжать не хотелось.', 'published', '2025-06-28T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'pansionat-edelveys'), 'Жанна', 'Ош', 5, 'Идеально для компании друзей. Большой двор, парковка, рядом магазины. Спасибо за приём!', 'published', '2025-08-11T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'pansionat-edelveys'), 'Игорь', 'Бишкек', 4, 'Хорошее соотношение цены и качества. Вода в озере тёплая, пляж рядом. Кондиционер спасал в жару.', 'published', '2025-07-22T12:00:00Z');

-- Объект: Пансионат «Радуга»
insert into public.properties (id, owner_id, slug, title, type, description, shore,
  location, address, latitude, longitude, distance_to_beach, max_guests, bedrooms,
  beds, bathrooms, price_per_night, old_price, rating, reviews_count, featured,
  popular, status, published_at)
values ('b7a4f868-9f8c-43c2-acbe-a3609ee6bcd0',
  (select op.id from public.owner_profiles op join auth.users u on u.id = op.user_id
   where op.display_name = 'Нурлан' limit 1),
  'pansionat-raduga', 'Пансионат «Радуга»', 'resort', 'Бюджетный семейный пансионат с бассейном и детской площадкой. Просто, чисто и недалеко от пляжа. Хороший вариант для отдыха без переплат.', 'north',
  'Бостери', 'Бостери, Иссык-Куль', 42.6642, 77.1555,
  300, 4, 2, 2, 1,
  3500, null, 4.4, 74,
  false, false, 'published', now())
on conflict (slug) do update set
  title = excluded.title, description = excluded.description,
  price_per_night = excluded.price_per_night, status = 'published',
  published_at = coalesce(public.properties.published_at, now());

delete from public.property_images where property_id = (select id from public.properties where slug = 'pansionat-raduga');
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-raduga'), 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=70', 0, true);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-raduga'), 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=70', 1, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-raduga'), 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=70', 2, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-raduga'), 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=70', 3, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-raduga'), 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=70', 4, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-raduga'), 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=70', 5, false);
delete from public.property_amenities where property_id = (select id from public.properties where slug = 'pansionat-raduga');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'pansionat-raduga'), 'wifi');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'pansionat-raduga'), 'pool');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'pansionat-raduga'), 'parking');
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'pansionat-raduga'), '2026-08-18', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'pansionat-raduga'), '2026-08-19', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'pansionat-raduga'), '2026-08-20', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'pansionat-raduga'), '2026-09-02', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'pansionat-raduga'), '2026-09-03', 'blocked') on conflict (property_id, date) do nothing;
delete from public.reviews where user_id is null and property_id = (select id from public.properties where slug = 'pansionat-raduga');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'pansionat-raduga'), 'Максим', 'Караганда', 5, 'Просторно, есть мангал и терраса с видом. Хозяин встретил, всё показал. Уезжать не хотелось.', 'published', '2025-06-28T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'pansionat-raduga'), 'Жанна', 'Ош', 5, 'Идеально для компании друзей. Большой двор, парковка, рядом магазины. Спасибо за приём!', 'published', '2025-08-11T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'pansionat-raduga'), 'Игорь', 'Бишкек', 4, 'Хорошее соотношение цены и качества. Вода в озере тёплая, пляж рядом. Кондиционер спасал в жару.', 'published', '2025-07-22T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'pansionat-raduga'), 'Салтанат', 'Алматы', 5, 'Очень тихое и красивое место. Утром вид на горы, вечером закат над озером. Всё как на фото.', 'published', '2025-06-15T12:00:00Z');

-- Объект: Пансионат «Marco Polo»
insert into public.properties (id, owner_id, slug, title, type, description, shore,
  location, address, latitude, longitude, distance_to_beach, max_guests, bedrooms,
  beds, bathrooms, price_per_night, old_price, rating, reviews_count, featured,
  popular, status, published_at)
values ('606974ac-ec58-4e89-b969-66c445b48eba',
  (select op.id from public.owner_profiles op join auth.users u on u.id = op.user_id
   where op.display_name = 'Азамат' limit 1),
  'pansionat-marco-polo', 'Пансионат «Marco Polo»', 'resort', 'Пансионат рядом с аэропортом Тамчы — удобно для тех, кто прилетает. Бассейн, ресторан, выход к пляжу. Комфортные номера с кондиционером.', 'south',
  'Тамчы', 'Тамчы, Иссык-Куль', 42.5688, 76.7201,
  120, 4, 2, 2, 1,
  5000, null, 4.3, 61,
  false, false, 'published', now())
on conflict (slug) do update set
  title = excluded.title, description = excluded.description,
  price_per_night = excluded.price_per_night, status = 'published',
  published_at = coalesce(public.properties.published_at, now());

delete from public.property_images where property_id = (select id from public.properties where slug = 'pansionat-marco-polo');
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-marco-polo'), 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=70', 0, true);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-marco-polo'), 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=70', 1, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-marco-polo'), 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=70', 2, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-marco-polo'), 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1200&q=70', 3, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-marco-polo'), 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=70', 4, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'pansionat-marco-polo'), 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=70', 5, false);
delete from public.property_amenities where property_id = (select id from public.properties where slug = 'pansionat-marco-polo');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'pansionat-marco-polo'), 'wifi');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'pansionat-marco-polo'), 'pool');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'pansionat-marco-polo'), 'beach');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'pansionat-marco-polo'), 'parking');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'pansionat-marco-polo'), 'ac');
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'pansionat-marco-polo'), '2026-08-19', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'pansionat-marco-polo'), '2026-08-20', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'pansionat-marco-polo'), '2026-08-21', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'pansionat-marco-polo'), '2026-08-30', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'pansionat-marco-polo'), '2026-08-31', 'blocked') on conflict (property_id, date) do nothing;
delete from public.reviews where user_id is null and property_id = (select id from public.properties where slug = 'pansionat-marco-polo');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'pansionat-marco-polo'), 'Жанна', 'Ош', 5, 'Идеально для компании друзей. Большой двор, парковка, рядом магазины. Спасибо за приём!', 'published', '2025-08-11T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'pansionat-marco-polo'), 'Игорь', 'Бишкек', 4, 'Хорошее соотношение цены и качества. Вода в озере тёплая, пляж рядом. Кондиционер спасал в жару.', 'published', '2025-07-22T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'pansionat-marco-polo'), 'Салтанат', 'Алматы', 5, 'Очень тихое и красивое место. Утром вид на горы, вечером закат над озером. Всё как на фото.', 'published', '2025-06-15T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'pansionat-marco-polo'), 'Тимур', 'Тараз', 5, 'Забронировали за минуту через WhatsApp, подтвердили сразу. Внутри свежий ремонт, всё новое.', 'published', '2025-08-06T12:00:00Z');

-- Объект: Lake House
insert into public.properties (id, owner_id, slug, title, type, description, shore,
  location, address, latitude, longitude, distance_to_beach, max_guests, bedrooms,
  beds, bathrooms, price_per_night, old_price, rating, reviews_count, featured,
  popular, status, published_at)
values ('67f6f4da-a7ba-47fb-b251-11d3e75ec3d9',
  (select op.id from public.owner_profiles op join auth.users u on u.id = op.user_id
   where op.display_name = 'Айгуль' limit 1),
  'lake-house', 'Lake House', 'cottage', 'Дом у самой воды с деревянной террасой над пляжем. Панорамные окна, современный интерьер, всё для отдыха у озера. Просыпаться под шум волн — бесценно.', 'south',
  'Кара-Ой', 'Кара-Ой, Иссык-Куль', 42.6288, 76.9855,
  60, 8, 3, 4, 2,
  9000, 10500, 4.9, 45,
  true, true, 'published', now())
on conflict (slug) do update set
  title = excluded.title, description = excluded.description,
  price_per_night = excluded.price_per_night, status = 'published',
  published_at = coalesce(public.properties.published_at, now());

delete from public.property_images where property_id = (select id from public.properties where slug = 'lake-house');
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'lake-house'), 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=70', 0, true);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'lake-house'), 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=70', 1, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'lake-house'), 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=70', 2, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'lake-house'), 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=70', 3, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'lake-house'), 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=70', 4, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'lake-house'), 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=70', 5, false);
delete from public.property_amenities where property_id = (select id from public.properties where slug = 'lake-house');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'lake-house'), 'wifi');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'lake-house'), 'kitchen');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'lake-house'), 'beach');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'lake-house'), 'terrace');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'lake-house'), 'bbq');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'lake-house'), 'parking');
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'lake-house'), '2026-08-20', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'lake-house'), '2026-08-21', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'lake-house'), '2026-08-22', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'lake-house'), '2026-08-31', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'lake-house'), '2026-09-01', 'blocked') on conflict (property_id, date) do nothing;
delete from public.reviews where user_id is null and property_id = (select id from public.properties where slug = 'lake-house');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'lake-house'), 'Игорь', 'Бишкек', 4, 'Хорошее соотношение цены и качества. Вода в озере тёплая, пляж рядом. Кондиционер спасал в жару.', 'published', '2025-07-22T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'lake-house'), 'Салтанат', 'Алматы', 5, 'Очень тихое и красивое место. Утром вид на горы, вечером закат над озером. Всё как на фото.', 'published', '2025-06-15T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'lake-house'), 'Тимур', 'Тараз', 5, 'Забронировали за минуту через WhatsApp, подтвердили сразу. Внутри свежий ремонт, всё новое.', 'published', '2025-08-06T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'lake-house'), 'Анна', 'Алматы', 5, 'Быстро нашли хороший дом в Чолпон-Ате. Фотографии полностью соответствовали реальности, хозяин оперативно подтвердил бронь. Приедем ещё.', 'published', '2025-07-18T12:00:00Z');

-- Объект: Nomad Residence
insert into public.properties (id, owner_id, slug, title, type, description, shore,
  location, address, latitude, longitude, distance_to_beach, max_guests, bedrooms,
  beds, bathrooms, price_per_night, old_price, rating, reviews_count, featured,
  popular, status, published_at)
values ('50aaef6d-6c04-449b-a39c-c805c815720d',
  (select op.id from public.owner_profiles op join auth.users u on u.id = op.user_id
   where op.display_name = 'Руслан' limit 1),
  'nomad-residence', 'Nomad Residence', 'villa', 'Дизайнерская резиденция в национальном стиле с современным комфортом. Бассейн, панорамная гостиная, пять спален. Идеально для больших семей и мероприятий.', 'south',
  'Чолпон-Ата', 'Чолпон-Ата, Иссык-Куль', 42.6533, 77.0888,
  220, 12, 5, 8, 4,
  15000, null, 4.8, 53,
  false, true, 'published', now())
on conflict (slug) do update set
  title = excluded.title, description = excluded.description,
  price_per_night = excluded.price_per_night, status = 'published',
  published_at = coalesce(public.properties.published_at, now());

delete from public.property_images where property_id = (select id from public.properties where slug = 'nomad-residence');
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'nomad-residence'), 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=70', 0, true);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'nomad-residence'), 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=70', 1, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'nomad-residence'), 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=70', 2, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'nomad-residence'), 'https://images.unsplash.com/photo-1518732714860-b62714ce0c59?auto=format&fit=crop&w=1200&q=70', 3, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'nomad-residence'), 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=70', 4, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'nomad-residence'), 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=70', 5, false);
delete from public.property_amenities where property_id = (select id from public.properties where slug = 'nomad-residence');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'nomad-residence'), 'wifi');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'nomad-residence'), 'parking');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'nomad-residence'), 'kitchen');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'nomad-residence'), 'ac');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'nomad-residence'), 'pool');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'nomad-residence'), 'bbq');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'nomad-residence'), 'terrace');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'nomad-residence'), 'tv');
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'nomad-residence'), '2026-08-21', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'nomad-residence'), '2026-08-22', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'nomad-residence'), '2026-08-23', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'nomad-residence'), '2026-09-01', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'nomad-residence'), '2026-09-02', 'blocked') on conflict (property_id, date) do nothing;
delete from public.reviews where user_id is null and property_id = (select id from public.properties where slug = 'nomad-residence');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'nomad-residence'), 'Салтанат', 'Алматы', 5, 'Очень тихое и красивое место. Утром вид на горы, вечером закат над озером. Всё как на фото.', 'published', '2025-06-15T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'nomad-residence'), 'Тимур', 'Тараз', 5, 'Забронировали за минуту через WhatsApp, подтвердили сразу. Внутри свежий ремонт, всё новое.', 'published', '2025-08-06T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'nomad-residence'), 'Анна', 'Алматы', 5, 'Быстро нашли хороший дом в Чолпон-Ате. Фотографии полностью соответствовали реальности, хозяин оперативно подтвердил бронь. Приедем ещё.', 'published', '2025-07-18T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'nomad-residence'), 'Дмитрий', 'Бишкек', 5, 'Чисто, уютно, до пляжа пешком пару минут. Отличное место для семейного отдыха, дети были в восторге от озера.', 'published', '2025-08-02T12:00:00Z');

-- Объект: Issyk Residence
insert into public.properties (id, owner_id, slug, title, type, description, shore,
  location, address, latitude, longitude, distance_to_beach, max_guests, bedrooms,
  beds, bathrooms, price_per_night, old_price, rating, reviews_count, featured,
  popular, status, published_at)
values ('28f77cae-7a69-4e95-9e20-199e466517a4',
  (select op.id from public.owner_profiles op join auth.users u on u.id = op.user_id
   where op.display_name = 'Гульнара' limit 1),
  'issyk-residence', 'Issyk Residence', 'apartment', 'Современные апартаменты в центре Чолпон-Аты. Новый дом, лифт, охраняемая парковка. В пешей доступности кафе, рынок и набережная.', 'south',
  'Чолпон-Ата', 'Чолпон-Ата, Иссык-Куль', 42.6467, 77.0812,
  400, 4, 2, 2, 1,
  4000, null, 4.6, 37,
  false, false, 'published', now())
on conflict (slug) do update set
  title = excluded.title, description = excluded.description,
  price_per_night = excluded.price_per_night, status = 'published',
  published_at = coalesce(public.properties.published_at, now());

delete from public.property_images where property_id = (select id from public.properties where slug = 'issyk-residence');
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'issyk-residence'), 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=70', 0, true);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'issyk-residence'), 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=70', 1, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'issyk-residence'), 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=70', 2, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'issyk-residence'), 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=70', 3, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'issyk-residence'), 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=70', 4, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'issyk-residence'), 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=70', 5, false);
delete from public.property_amenities where property_id = (select id from public.properties where slug = 'issyk-residence');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'issyk-residence'), 'wifi');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'issyk-residence'), 'kitchen');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'issyk-residence'), 'ac');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'issyk-residence'), 'parking');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'issyk-residence'), 'tv');
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'issyk-residence'), '2026-08-17', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'issyk-residence'), '2026-08-18', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'issyk-residence'), '2026-08-19', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'issyk-residence'), '2026-09-02', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'issyk-residence'), '2026-09-03', 'blocked') on conflict (property_id, date) do nothing;
delete from public.reviews where user_id is null and property_id = (select id from public.properties where slug = 'issyk-residence');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'issyk-residence'), 'Тимур', 'Тараз', 5, 'Забронировали за минуту через WhatsApp, подтвердили сразу. Внутри свежий ремонт, всё новое.', 'published', '2025-08-06T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'issyk-residence'), 'Анна', 'Алматы', 5, 'Быстро нашли хороший дом в Чолпон-Ате. Фотографии полностью соответствовали реальности, хозяин оперативно подтвердил бронь. Приедем ещё.', 'published', '2025-07-18T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'issyk-residence'), 'Дмитрий', 'Бишкек', 5, 'Чисто, уютно, до пляжа пешком пару минут. Отличное место для семейного отдыха, дети были в восторге от озера.', 'published', '2025-08-02T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'issyk-residence'), 'Асель', 'Астана', 4, 'Всё понравилось, кухня оборудована, Wi-Fi работал стабильно. Немного шумновато вечером, но в целом рекомендую.', 'published', '2025-07-05T12:00:00Z');

-- Объект: Sunrise Cottage
insert into public.properties (id, owner_id, slug, title, type, description, shore,
  location, address, latitude, longitude, distance_to_beach, max_guests, bedrooms,
  beds, bathrooms, price_per_night, old_price, rating, reviews_count, featured,
  popular, status, published_at)
values ('1754ae31-ccdc-4126-a71d-d91918d8d671',
  (select op.id from public.owner_profiles op join auth.users u on u.id = op.user_id
   where op.display_name = 'Бекзат' limit 1),
  'sunrise-cottage', 'Sunrise Cottage', 'cottage', 'Коттедж на тихом северном берегу с видом на восход над озером. Мангал, зелёный двор, до пляжа меньше ста метров. Спокойствие и природа.', 'north',
  'Корумду', 'Корумду, Иссык-Куль', 42.6711, 77.2098,
  90, 6, 2, 3, 1,
  5000, null, 4.7, 34,
  false, true, 'published', now())
on conflict (slug) do update set
  title = excluded.title, description = excluded.description,
  price_per_night = excluded.price_per_night, status = 'published',
  published_at = coalesce(public.properties.published_at, now());

delete from public.property_images where property_id = (select id from public.properties where slug = 'sunrise-cottage');
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'sunrise-cottage'), 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1200&q=70', 0, true);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'sunrise-cottage'), 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=70', 1, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'sunrise-cottage'), 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=70', 2, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'sunrise-cottage'), 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=70', 3, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'sunrise-cottage'), 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=70', 4, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'sunrise-cottage'), 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=70', 5, false);
delete from public.property_amenities where property_id = (select id from public.properties where slug = 'sunrise-cottage');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'sunrise-cottage'), 'wifi');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'sunrise-cottage'), 'kitchen');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'sunrise-cottage'), 'beach');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'sunrise-cottage'), 'parking');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'sunrise-cottage'), 'bbq');
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'sunrise-cottage'), '2026-08-18', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'sunrise-cottage'), '2026-08-19', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'sunrise-cottage'), '2026-08-20', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'sunrise-cottage'), '2026-08-30', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'sunrise-cottage'), '2026-08-31', 'blocked') on conflict (property_id, date) do nothing;
delete from public.reviews where user_id is null and property_id = (select id from public.properties where slug = 'sunrise-cottage');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'sunrise-cottage'), 'Анна', 'Алматы', 5, 'Быстро нашли хороший дом в Чолпон-Ате. Фотографии полностью соответствовали реальности, хозяин оперативно подтвердил бронь. Приедем ещё.', 'published', '2025-07-18T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'sunrise-cottage'), 'Дмитрий', 'Бишкек', 5, 'Чисто, уютно, до пляжа пешком пару минут. Отличное место для семейного отдыха, дети были в восторге от озера.', 'published', '2025-08-02T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'sunrise-cottage'), 'Асель', 'Астана', 4, 'Всё понравилось, кухня оборудована, Wi-Fi работал стабильно. Немного шумновато вечером, но в целом рекомендую.', 'published', '2025-07-05T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'sunrise-cottage'), 'Максим', 'Караганда', 5, 'Просторно, есть мангал и терраса с видом. Хозяин встретил, всё показал. Уезжать не хотелось.', 'published', '2025-06-28T12:00:00Z');

-- Объект: Alpine Lake House
insert into public.properties (id, owner_id, slug, title, type, description, shore,
  location, address, latitude, longitude, distance_to_beach, max_guests, bedrooms,
  beds, bathrooms, price_per_night, old_price, rating, reviews_count, featured,
  popular, status, published_at)
values ('caa5a0d0-47ee-4900-8487-58ff818f9c61',
  (select op.id from public.owner_profiles op join auth.users u on u.id = op.user_id
   where op.display_name = 'Нурлан' limit 1),
  'alpine-lake-house', 'Alpine Lake House', 'cottage', 'Дом в альпийском стиле с камином и большой террасой. Тёплый уют деревянных интерьеров и вид на горы. Подходит и для летнего, и для межсезонного отдыха.', 'south',
  'Кара-Ой', 'Кара-Ой, Иссык-Куль', 42.6275, 76.9799,
  130, 8, 3, 5, 2,
  7500, null, 4.8, 41,
  false, false, 'published', now())
on conflict (slug) do update set
  title = excluded.title, description = excluded.description,
  price_per_night = excluded.price_per_night, status = 'published',
  published_at = coalesce(public.properties.published_at, now());

delete from public.property_images where property_id = (select id from public.properties where slug = 'alpine-lake-house');
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'alpine-lake-house'), 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=70', 0, true);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'alpine-lake-house'), 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=70', 1, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'alpine-lake-house'), 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=70', 2, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'alpine-lake-house'), 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1200&q=70', 3, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'alpine-lake-house'), 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=70', 4, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'alpine-lake-house'), 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=70', 5, false);
delete from public.property_amenities where property_id = (select id from public.properties where slug = 'alpine-lake-house');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'alpine-lake-house'), 'wifi');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'alpine-lake-house'), 'kitchen');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'alpine-lake-house'), 'ac');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'alpine-lake-house'), 'terrace');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'alpine-lake-house'), 'parking');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'alpine-lake-house'), 'tv');
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'alpine-lake-house'), '2026-08-19', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'alpine-lake-house'), '2026-08-20', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'alpine-lake-house'), '2026-08-21', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'alpine-lake-house'), '2026-08-31', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'alpine-lake-house'), '2026-09-01', 'blocked') on conflict (property_id, date) do nothing;
delete from public.reviews where user_id is null and property_id = (select id from public.properties where slug = 'alpine-lake-house');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'alpine-lake-house'), 'Дмитрий', 'Бишкек', 5, 'Чисто, уютно, до пляжа пешком пару минут. Отличное место для семейного отдыха, дети были в восторге от озера.', 'published', '2025-08-02T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'alpine-lake-house'), 'Асель', 'Астана', 4, 'Всё понравилось, кухня оборудована, Wi-Fi работал стабильно. Немного шумновато вечером, но в целом рекомендую.', 'published', '2025-07-05T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'alpine-lake-house'), 'Максим', 'Караганда', 5, 'Просторно, есть мангал и терраса с видом. Хозяин встретил, всё показал. Уезжать не хотелось.', 'published', '2025-06-28T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'alpine-lake-house'), 'Жанна', 'Ош', 5, 'Идеально для компании друзей. Большой двор, парковка, рядом магазины. Спасибо за приём!', 'published', '2025-08-11T12:00:00Z');

-- Объект: Гостевой дом «Жетиген»
insert into public.properties (id, owner_id, slug, title, type, description, shore,
  location, address, latitude, longitude, distance_to_beach, max_guests, bedrooms,
  beds, bathrooms, price_per_night, old_price, rating, reviews_count, featured,
  popular, status, published_at)
values ('23624877-d8b1-4fab-b4f7-ad5193434ac4',
  (select op.id from public.owner_profiles op join auth.users u on u.id = op.user_id
   where op.display_name = 'Азамат' limit 1),
  'guest-house-jetigen', 'Гостевой дом «Жетиген»', 'guesthouse', 'Аутентичный гостевой дом на южном берегу рядом с юрточным лагерем. Домашняя кухня, национальный колорит и радушные хозяева. Отправная точка к Сказке и Барскоону.', 'south',
  'Боконбаево', 'Боконбаево, Иссык-Куль', 42.1289, 76.9877,
  500, 8, 4, 6, 2,
  3500, null, 4.5, 27,
  false, false, 'published', now())
on conflict (slug) do update set
  title = excluded.title, description = excluded.description,
  price_per_night = excluded.price_per_night, status = 'published',
  published_at = coalesce(public.properties.published_at, now());

delete from public.property_images where property_id = (select id from public.properties where slug = 'guest-house-jetigen');
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'guest-house-jetigen'), 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=70', 0, true);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'guest-house-jetigen'), 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=70', 1, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'guest-house-jetigen'), 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=70', 2, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'guest-house-jetigen'), 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=70', 3, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'guest-house-jetigen'), 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=70', 4, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'guest-house-jetigen'), 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=70', 5, false);
delete from public.property_amenities where property_id = (select id from public.properties where slug = 'guest-house-jetigen');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'guest-house-jetigen'), 'wifi');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'guest-house-jetigen'), 'kitchen');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'guest-house-jetigen'), 'breakfast');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'guest-house-jetigen'), 'parking');
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'guest-house-jetigen'), '2026-08-20', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'guest-house-jetigen'), '2026-08-21', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'guest-house-jetigen'), '2026-08-22', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'guest-house-jetigen'), '2026-09-01', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'guest-house-jetigen'), '2026-09-02', 'blocked') on conflict (property_id, date) do nothing;
delete from public.reviews where user_id is null and property_id = (select id from public.properties where slug = 'guest-house-jetigen');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'guest-house-jetigen'), 'Асель', 'Астана', 4, 'Всё понравилось, кухня оборудована, Wi-Fi работал стабильно. Немного шумновато вечером, но в целом рекомендую.', 'published', '2025-07-05T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'guest-house-jetigen'), 'Максим', 'Караганда', 5, 'Просторно, есть мангал и терраса с видом. Хозяин встретил, всё показал. Уезжать не хотелось.', 'published', '2025-06-28T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'guest-house-jetigen'), 'Жанна', 'Ош', 5, 'Идеально для компании друзей. Большой двор, парковка, рядом магазины. Спасибо за приём!', 'published', '2025-08-11T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'guest-house-jetigen'), 'Игорь', 'Бишкек', 4, 'Хорошее соотношение цены и качества. Вода в озере тёплая, пляж рядом. Кондиционер спасал в жару.', 'published', '2025-07-22T12:00:00Z');

-- Объект: Апартаменты «Бриз»
insert into public.properties (id, owner_id, slug, title, type, description, shore,
  location, address, latitude, longitude, distance_to_beach, max_guests, bedrooms,
  beds, bathrooms, price_per_night, old_price, rating, reviews_count, featured,
  popular, status, published_at)
values ('43cad4b6-2fcf-4f4b-a19a-d6dcc8f4205d',
  (select op.id from public.owner_profiles op join auth.users u on u.id = op.user_id
   where op.display_name = 'Айгуль' limit 1),
  'apartamenty-briz', 'Апартаменты «Бриз»', 'apartment', 'Небольшие апартаменты для пары или троих. Есть всё для самостоятельного отдыха: кухня, кондиционер, быстрый интернет. До пляжа — 5 минут пешком.', 'north',
  'Бостери', 'Бостери, Иссык-Куль', 42.6598, 77.1499,
  250, 3, 1, 2, 1,
  3000, null, 4.4, 19,
  false, false, 'published', now())
on conflict (slug) do update set
  title = excluded.title, description = excluded.description,
  price_per_night = excluded.price_per_night, status = 'published',
  published_at = coalesce(public.properties.published_at, now());

delete from public.property_images where property_id = (select id from public.properties where slug = 'apartamenty-briz');
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'apartamenty-briz'), 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=70', 0, true);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'apartamenty-briz'), 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=70', 1, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'apartamenty-briz'), 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=70', 2, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'apartamenty-briz'), 'https://images.unsplash.com/photo-1518732714860-b62714ce0c59?auto=format&fit=crop&w=1200&q=70', 3, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'apartamenty-briz'), 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=70', 4, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'apartamenty-briz'), 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=70', 5, false);
delete from public.property_amenities where property_id = (select id from public.properties where slug = 'apartamenty-briz');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'apartamenty-briz'), 'wifi');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'apartamenty-briz'), 'kitchen');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'apartamenty-briz'), 'ac');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'apartamenty-briz'), 'tv');
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'apartamenty-briz'), '2026-08-21', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'apartamenty-briz'), '2026-08-22', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'apartamenty-briz'), '2026-08-23', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'apartamenty-briz'), '2026-09-02', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'apartamenty-briz'), '2026-09-03', 'blocked') on conflict (property_id, date) do nothing;
delete from public.reviews where user_id is null and property_id = (select id from public.properties where slug = 'apartamenty-briz');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'apartamenty-briz'), 'Максим', 'Караганда', 5, 'Просторно, есть мангал и терраса с видом. Хозяин встретил, всё показал. Уезжать не хотелось.', 'published', '2025-06-28T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'apartamenty-briz'), 'Жанна', 'Ош', 5, 'Идеально для компании друзей. Большой двор, парковка, рядом магазины. Спасибо за приём!', 'published', '2025-08-11T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'apartamenty-briz'), 'Игорь', 'Бишкек', 4, 'Хорошее соотношение цены и качества. Вода в озере тёплая, пляж рядом. Кондиционер спасал в жару.', 'published', '2025-07-22T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'apartamenty-briz'), 'Салтанат', 'Алматы', 5, 'Очень тихое и красивое место. Утром вид на горы, вечером закат над озером. Всё как на фото.', 'published', '2025-06-15T12:00:00Z');

-- Объект: Вилла «Жаз»
insert into public.properties (id, owner_id, slug, title, type, description, shore,
  location, address, latitude, longitude, distance_to_beach, max_guests, bedrooms,
  beds, bathrooms, price_per_night, old_price, rating, reviews_count, featured,
  popular, status, published_at)
values ('f472acf1-886e-4de9-b1d5-50ec09442f93',
  (select op.id from public.owner_profiles op join auth.users u on u.id = op.user_id
   where op.display_name = 'Руслан' limit 1),
  'villa-jaz', 'Вилла «Жаз»', 'villa', 'Светлая вилла с бассейном на северном берегу. Минималистичный дизайн, много воздуха и света, зона отдыха у воды. Для тех, кто ценит стиль и приватность.', 'north',
  'Чок-Тал', 'Чок-Тал, Иссык-Куль', 42.6822, 76.9433,
  160, 10, 4, 6, 3,
  13000, null, 4.9, 46,
  true, false, 'published', now())
on conflict (slug) do update set
  title = excluded.title, description = excluded.description,
  price_per_night = excluded.price_per_night, status = 'published',
  published_at = coalesce(public.properties.published_at, now());

delete from public.property_images where property_id = (select id from public.properties where slug = 'villa-jaz');
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'villa-jaz'), 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=70', 0, true);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'villa-jaz'), 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=70', 1, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'villa-jaz'), 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=70', 2, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'villa-jaz'), 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=70', 3, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'villa-jaz'), 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=70', 4, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'villa-jaz'), 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=70', 5, false);
delete from public.property_amenities where property_id = (select id from public.properties where slug = 'villa-jaz');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'villa-jaz'), 'wifi');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'villa-jaz'), 'parking');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'villa-jaz'), 'kitchen');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'villa-jaz'), 'ac');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'villa-jaz'), 'pool');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'villa-jaz'), 'bbq');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'villa-jaz'), 'terrace');
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'villa-jaz'), '2026-08-17', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'villa-jaz'), '2026-08-18', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'villa-jaz'), '2026-08-19', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'villa-jaz'), '2026-08-30', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'villa-jaz'), '2026-08-31', 'blocked') on conflict (property_id, date) do nothing;
delete from public.reviews where user_id is null and property_id = (select id from public.properties where slug = 'villa-jaz');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'villa-jaz'), 'Жанна', 'Ош', 5, 'Идеально для компании друзей. Большой двор, парковка, рядом магазины. Спасибо за приём!', 'published', '2025-08-11T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'villa-jaz'), 'Игорь', 'Бишкек', 4, 'Хорошее соотношение цены и качества. Вода в озере тёплая, пляж рядом. Кондиционер спасал в жару.', 'published', '2025-07-22T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'villa-jaz'), 'Салтанат', 'Алматы', 5, 'Очень тихое и красивое место. Утром вид на горы, вечером закат над озером. Всё как на фото.', 'published', '2025-06-15T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'villa-jaz'), 'Тимур', 'Тараз', 5, 'Забронировали за минуту через WhatsApp, подтвердили сразу. Внутри свежий ремонт, всё новое.', 'published', '2025-08-06T12:00:00Z');

-- Объект: Шале «Кунгей»
insert into public.properties (id, owner_id, slug, title, type, description, shore,
  location, address, latitude, longitude, distance_to_beach, max_guests, bedrooms,
  beds, bathrooms, price_per_night, old_price, rating, reviews_count, featured,
  popular, status, published_at)
values ('a85b1149-8177-4320-b221-e28f9a4d8bd1',
  (select op.id from public.owner_profiles op join auth.users u on u.id = op.user_id
   where op.display_name = 'Гульнара' limit 1),
  'chalet-kungey', 'Шале «Кунгей»', 'cottage', 'Уютное шале с видом на хребет Кунгей. Дерево, панорамные окна, камин и большая терраса. Атмосфера горного отдыха в двух шагах от озера.', 'north',
  'Чок-Тал', 'Чок-Тал, Иссык-Куль', 42.6801, 76.9401,
  140, 8, 3, 5, 2,
  8000, null, 4.7, 31,
  false, true, 'published', now())
on conflict (slug) do update set
  title = excluded.title, description = excluded.description,
  price_per_night = excluded.price_per_night, status = 'published',
  published_at = coalesce(public.properties.published_at, now());

delete from public.property_images where property_id = (select id from public.properties where slug = 'chalet-kungey');
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'chalet-kungey'), 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=70', 0, true);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'chalet-kungey'), 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=70', 1, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'chalet-kungey'), 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=70', 2, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'chalet-kungey'), 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=70', 3, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'chalet-kungey'), 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=70', 4, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'chalet-kungey'), 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=70', 5, false);
delete from public.property_amenities where property_id = (select id from public.properties where slug = 'chalet-kungey');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'chalet-kungey'), 'wifi');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'chalet-kungey'), 'kitchen');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'chalet-kungey'), 'terrace');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'chalet-kungey'), 'bbq');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'chalet-kungey'), 'parking');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'chalet-kungey'), 'tv');
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'chalet-kungey'), '2026-08-18', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'chalet-kungey'), '2026-08-19', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'chalet-kungey'), '2026-08-20', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'chalet-kungey'), '2026-08-31', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'chalet-kungey'), '2026-09-01', 'blocked') on conflict (property_id, date) do nothing;
delete from public.reviews where user_id is null and property_id = (select id from public.properties where slug = 'chalet-kungey');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'chalet-kungey'), 'Игорь', 'Бишкек', 4, 'Хорошее соотношение цены и качества. Вода в озере тёплая, пляж рядом. Кондиционер спасал в жару.', 'published', '2025-07-22T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'chalet-kungey'), 'Салтанат', 'Алматы', 5, 'Очень тихое и красивое место. Утром вид на горы, вечером закат над озером. Всё как на фото.', 'published', '2025-06-15T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'chalet-kungey'), 'Тимур', 'Тараз', 5, 'Забронировали за минуту через WhatsApp, подтвердили сразу. Внутри свежий ремонт, всё новое.', 'published', '2025-08-06T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'chalet-kungey'), 'Анна', 'Алматы', 5, 'Быстро нашли хороший дом в Чолпон-Ате. Фотографии полностью соответствовали реальности, хозяин оперативно подтвердил бронь. Приедем ещё.', 'published', '2025-07-18T12:00:00Z');

-- Объект: Beach House Тамчы
insert into public.properties (id, owner_id, slug, title, type, description, shore,
  location, address, latitude, longitude, distance_to_beach, max_guests, bedrooms,
  beds, bathrooms, price_per_night, old_price, rating, reviews_count, featured,
  popular, status, published_at)
values ('4349aa4a-b648-4941-94ff-c03c584bcc79',
  (select op.id from public.owner_profiles op join auth.users u on u.id = op.user_id
   where op.display_name = 'Бекзат' limit 1),
  'beach-house-tamchy', 'Beach House Тамчы', 'cottage', 'Дом прямо у пляжа в Тамчы — всего 50 метров до воды. Терраса с видом на озеро, мангал, современная кухня. Лучшее место, чтобы встречать закаты.', 'south',
  'Тамчы', 'Тамчы, Иссык-Куль', 42.5677, 76.7155,
  50, 6, 2, 4, 2,
  6500, null, 4.8, 38,
  false, true, 'published', now())
on conflict (slug) do update set
  title = excluded.title, description = excluded.description,
  price_per_night = excluded.price_per_night, status = 'published',
  published_at = coalesce(public.properties.published_at, now());

delete from public.property_images where property_id = (select id from public.properties where slug = 'beach-house-tamchy');
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'beach-house-tamchy'), 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=70', 0, true);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'beach-house-tamchy'), 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=70', 1, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'beach-house-tamchy'), 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=70', 2, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'beach-house-tamchy'), 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1200&q=70', 3, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'beach-house-tamchy'), 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=70', 4, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'beach-house-tamchy'), 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=70', 5, false);
delete from public.property_amenities where property_id = (select id from public.properties where slug = 'beach-house-tamchy');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'beach-house-tamchy'), 'wifi');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'beach-house-tamchy'), 'kitchen');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'beach-house-tamchy'), 'beach');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'beach-house-tamchy'), 'terrace');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'beach-house-tamchy'), 'bbq');
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'beach-house-tamchy'), '2026-08-19', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'beach-house-tamchy'), '2026-08-20', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'beach-house-tamchy'), '2026-08-21', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'beach-house-tamchy'), '2026-09-01', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'beach-house-tamchy'), '2026-09-02', 'blocked') on conflict (property_id, date) do nothing;
delete from public.reviews where user_id is null and property_id = (select id from public.properties where slug = 'beach-house-tamchy');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'beach-house-tamchy'), 'Салтанат', 'Алматы', 5, 'Очень тихое и красивое место. Утром вид на горы, вечером закат над озером. Всё как на фото.', 'published', '2025-06-15T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'beach-house-tamchy'), 'Тимур', 'Тараз', 5, 'Забронировали за минуту через WhatsApp, подтвердили сразу. Внутри свежий ремонт, всё новое.', 'published', '2025-08-06T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'beach-house-tamchy'), 'Анна', 'Алматы', 5, 'Быстро нашли хороший дом в Чолпон-Ате. Фотографии полностью соответствовали реальности, хозяин оперативно подтвердил бронь. Приедем ещё.', 'published', '2025-07-18T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'beach-house-tamchy'), 'Дмитрий', 'Бишкек', 5, 'Чисто, уютно, до пляжа пешком пару минут. Отличное место для семейного отдыха, дети были в восторге от озера.', 'published', '2025-08-02T12:00:00Z');

-- Объект: Апартаменты «Plaza»
insert into public.properties (id, owner_id, slug, title, type, description, shore,
  location, address, latitude, longitude, distance_to_beach, max_guests, bedrooms,
  beds, bathrooms, price_per_night, old_price, rating, reviews_count, featured,
  popular, status, published_at)
values ('199e6906-f582-453a-9d0b-40483bdddd87',
  (select op.id from public.owner_profiles op join auth.users u on u.id = op.user_id
   where op.display_name = 'Нурлан' limit 1),
  'apartamenty-plaza', 'Апартаменты «Plaza»', 'apartment', 'Апартаменты в новом жилом комплексе с бассейном во дворе. Свежий ремонт, всё необходимое, охраняемая территория. Удобно и для отдыха, и для работы у озера.', 'south',
  'Чолпон-Ата', 'Чолпон-Ата, Иссык-Куль', 42.6455, 77.0844,
  350, 4, 2, 2, 1,
  4500, null, 4.5, 22,
  false, false, 'published', now())
on conflict (slug) do update set
  title = excluded.title, description = excluded.description,
  price_per_night = excluded.price_per_night, status = 'published',
  published_at = coalesce(public.properties.published_at, now());

delete from public.property_images where property_id = (select id from public.properties where slug = 'apartamenty-plaza');
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'apartamenty-plaza'), 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=70', 0, true);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'apartamenty-plaza'), 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=70', 1, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'apartamenty-plaza'), 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=70', 2, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'apartamenty-plaza'), 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=70', 3, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'apartamenty-plaza'), 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=70', 4, false);
insert into public.property_images (property_id, url, sort_order, is_cover) values ((select id from public.properties where slug = 'apartamenty-plaza'), 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=70', 5, false);
delete from public.property_amenities where property_id = (select id from public.properties where slug = 'apartamenty-plaza');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'apartamenty-plaza'), 'wifi');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'apartamenty-plaza'), 'kitchen');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'apartamenty-plaza'), 'ac');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'apartamenty-plaza'), 'parking');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'apartamenty-plaza'), 'tv');
insert into public.property_amenities (property_id, amenity_key) values ((select id from public.properties where slug = 'apartamenty-plaza'), 'pool');
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'apartamenty-plaza'), '2026-08-20', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'apartamenty-plaza'), '2026-08-21', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'apartamenty-plaza'), '2026-08-22', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'apartamenty-plaza'), '2026-09-02', 'blocked') on conflict (property_id, date) do nothing;
insert into public.property_availability (property_id, date, status) values ((select id from public.properties where slug = 'apartamenty-plaza'), '2026-09-03', 'blocked') on conflict (property_id, date) do nothing;
delete from public.reviews where user_id is null and property_id = (select id from public.properties where slug = 'apartamenty-plaza');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'apartamenty-plaza'), 'Тимур', 'Тараз', 5, 'Забронировали за минуту через WhatsApp, подтвердили сразу. Внутри свежий ремонт, всё новое.', 'published', '2025-08-06T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'apartamenty-plaza'), 'Анна', 'Алматы', 5, 'Быстро нашли хороший дом в Чолпон-Ате. Фотографии полностью соответствовали реальности, хозяин оперативно подтвердил бронь. Приедем ещё.', 'published', '2025-07-18T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'apartamenty-plaza'), 'Дмитрий', 'Бишкек', 5, 'Чисто, уютно, до пляжа пешком пару минут. Отличное место для семейного отдыха, дети были в восторге от озера.', 'published', '2025-08-02T12:00:00Z');
insert into public.reviews (property_id, author_name, author_city, rating, text, status, created_at) values ((select id from public.properties where slug = 'apartamenty-plaza'), 'Асель', 'Астана', 4, 'Всё понравилось, кухня оборудована, Wi-Fi работал стабильно. Немного шумновато вечером, но в целом рекомендую.', 'published', '2025-07-05T12:00:00Z');
commit;
select count(*) as properties_seeded from public.properties where status = 'published';