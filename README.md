# IK-HOUSE — аренда жилья на Иссык-Куле

MVP сервиса поиска и бронирования жилья (коттеджи, гостевые дома, пансионаты,
виллы, апартаменты) на Иссык-Куле. Построен на **Next.js 14 (App Router) +
TypeScript + Tailwind CSS**.

## Возможности

- Главная с поиском (локация, даты, гости) и умной логикой дат
- Каталог с **рабочими** фильтрами (берег, цена, гости, тип, удобства), сортировкой,
  переключателем «Список / Карта», синхронизацией фильтров с URL
- Страница объекта: галерея с fullscreen-просмотром, календарь занятости,
  карта (OpenStreetMap), карточка владельца (WhatsApp/звонок), отзывы, похожие варианты
- Бронирование: форма с валидацией (React Hook Form + Zod), расчёт стоимости,
  экран успеха с номером заявки
- API `/api/booking` с интеграцией Telegram (с безопасным fallback без ключей)
- Избранное (сохраняется в `localStorage`), страница `/favorites`
- Полностью адаптивный дизайн, мобильное меню, sticky-CTA на странице объекта
- SEO-метаданные, OpenGraph, JSON-LD (LodgingBusiness)

## Быстрый старт

```bash
npm install
npm run dev
```

Откройте http://localhost:3000

## Production

```bash
npm run build
npm start
```


## Этап 1: аккаунты и база данных (Supabase)

Проект подключён к Supabase (PostgreSQL + Auth + Storage, RLS включён).
Без переменных окружения сайт продолжает работать на demo-данных.

### Настройка Supabase

1. Создайте проект на https://supabase.com (Free-план достаточно).
2. Скопируйте `.env.example` в `.env.local` и заполните:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (только сервер, не коммитить!)
3. Примените миграцию: откройте SQL Editor в панели Supabase и выполните
   содержимое `supabase/migrations/0001_init.sql` (либо `supabase db push`
   при использовании Supabase CLI).
4. В Authentication -> URL Configuration укажите Site URL вашего продакшена
   (например `https://ik-house.vercel.app`) и добавьте
   `https://<домен>/auth/callback` в Redirect URLs.

### Seed: перенос demo-объектов в БД

```bash
npm run seed
```

Скрипт идемпотентен: создаёт 6 demo-владельцев и 24 объекта (published),
фотографии, удобства, занятые даты и отзывы. Каталог остаётся заполненным.

### Первый администратор

Роль admin назначается только сервером:

```bash
# 1) зарегистрируйтесь на сайте и подтвердите email
# 2) затем:
npm run create-admin -- your-email@example.com
```

### Что появилось в Этапе 1

- Регистрация / вход / восстановление пароля / подтверждение email (Supabase Auth)
- Личный кабинет гостя: обзор, профиль (+аватар), мои заявки, избранное
- Заявки на бронирование сохраняются в БД; цена считается ТОЛЬКО на сервере
  (RPC `create_booking` с защитой от прошедших дат, овербукинга и гонок)
- Бронирование работает и без регистрации; после заявки — мягкое предложение
  создать аккаунт
- Избранное синхронизируется с БД для вошедших (merge с localStorage)
- Каталог, карточки и главная читают published-объекты из БД
- RLS-политики: гость видит только своё, владелец — только своих объектов,
  админ — всё; функции подтверждения/отклонения заявок готовы для Этапа 2

### Деплой на Vercel

1. Запушьте репозиторий на GitHub.
2. В Vercel: Add New Project -> импортируйте репозиторий.
3. Добавьте переменные окружения из `.env.local` (Environment Variables).
4. Deploy. Каждый push в main будет автоматически публиковаться.

## Переменные окружения

Скопируйте `.env.example` в `.env.local` и заполните нужные значения.
Все переменные опциональны — без них сайт работает (заявки логируются в консоль,
карта берётся из OpenStreetMap, аналитика отключена).

```bash
cp .env.example .env.local
```

## Что где менять

| Задача | Файл |
| --- | --- |
| Объекты (жильё), фото, цены, владельцы | `data/properties.ts` |
| Свои фотографии | положите в `public/images/...` и укажите пути в `data/properties.ts` |
| Номер WhatsApp / телефон / email сервиса | `lib/constants.ts` → `CONTACTS` |
| Контакты владельца конкретного объекта | `data/properties.ts` → `OWNERS` |
| Цвета, шрифты, радиусы (дизайн-система) | `tailwind.config.ts` и `app/globals.css` |
| Логика фильтров и сортировки | `lib/filters.ts`, `lib/url.ts` |
| Расчёт стоимости | `lib/pricing.ts` |
| Текст сообщения в Telegram | `lib/telegram.ts` |
| Подключение Google Analytics / Meta Pixel | `components/Analytics.tsx` (+ env) |
| Карта | `components/property/MapBlock.tsx`, `components/catalog/CatalogMap.tsx` |

## Telegram-бот (получение заявок)

1. Создайте бота у [@BotFather](https://t.me/BotFather), получите `TELEGRAM_BOT_TOKEN`.
2. Узнайте `TELEGRAM_CHAT_ID` (например, через @userinfobot или API `getUpdates`).
3. Заполните обе переменные в `.env.local` и перезапустите сервер.

Без этих переменных приложение не падает — заявка выводится в консоль сервера,
а API возвращает успешный ответ с номером заявки.

## Фотографии

Для наполнения используются фотографии Unsplash CDN (загружаются напрямую).
У всех изображений есть встроенный fallback (`components/ui/SafeImage.tsx`),
поэтому недоступное фото не ломает вёрстку. Чтобы поставить свои фото —
положите файлы в `public/images/properties/` и укажите относительные пути.

## Замена mock-данных на реальную БД

Данные лежат в `data/properties.ts` и читаются через функции
`getProperty`, `getFeatured`, `getSimilar`. Чтобы подключить БД
(Firestore, MongoDB, PostgreSQL, Supabase), замените эти функции на
асинхронные запросы к вашему источнику — интерфейс `Property`
(`types/property.ts`) остаётся тем же. API бронирования (`app/api/booking/route.ts`)
уже вынесен отдельно: туда легко добавить запись в БД, email или webhook в CRM.

## Структура

```
app/                     страницы и API
  page.tsx               главная
  catalog/               каталог
  property/[slug]/       карточка объекта
  booking/[slug]/        бронирование
  favorites/             избранное
  api/booking/route.ts   приём заявок
components/               UI-компоненты по разделам
data/properties.ts       mock-база объектов
lib/                     утилиты, фильтры, цены, валидация, telegram
types/property.ts        типы
```

## Стек

Next.js · React · TypeScript · Tailwind CSS · React Hook Form · Zod ·
date-fns · lucide-react

---

© 2026 IK-HOUSE

## Mobile + PWA (Этап 4)

IK-HOUSE — один Next.js-проект, обслуживающий Desktop Web, Mobile Web и installable PWA.

### Мобильная навигация
- Нижняя навигация (`components/layout/BottomNav.tsx`): Главная · Поиск · Избранное · Заявки · Профиль; в разделе владельца — Обзор · Объекты · Добавить · Заявки · Профиль. Fixed, safe-area aware, скрывается на страницах со sticky-CTA (объект, бронирование, мастер, админка).
- Sticky booking CTA на странице объекта (`MobileStickyCta`) и sticky-контролы мастера учитывают `env(safe-area-inset-bottom)`.

### PWA
- Манифест: `app/manifest.ts` (name, standalone, theme #2563eb, shortcuts).
- Иконки: `public/icons/` — 192, 512, maskable-512, apple-touch-icon (180).
- iOS: `appleWebApp` metadata + `viewport-fit=cover` в `app/layout.tsx`.
- Установка: Android — баннер по `beforeinstallprompt` (не сразу, dismissible); iPhone — подсказка «Поделиться → На экран Домой» через 20 сек, с сохранением dismissed-state (`components/pwa/PwaProvider.tsx`).

### Service Worker (`public/sw.js`)
Кэшируется: `/_next/static/*` и `/icons/*` (cache-first, иммутабельно), изображения (cache-first, лимит 60), публичные страницы (network-first с offline-fallback), офлайн-страница `public/offline.html`.
НЕ кэшируется: `/api/*`, все запросы к `*.supabase.co` (auth и данные), приватные разделы `/account`, `/owner`, `/admin`, `/auth`, любые не-GET запросы. Бронирование офлайн невозможно — показывается честная офлайн-страница, «ложных заявок» нет.
Обновление версии: при новом деплое появляется toast «Доступна новая версия — Обновить» (skipWaiting + reload).

### Как проверить
- Android (Chrome): открыть сайт → появится «Установить IK-HOUSE» (или меню ⋮ → «Добавить на гл. экран»).
- iPhone (Safari): «Поделиться» → «На экран “Домой”».
- Offline: DevTools → Network → Offline → перейти на страницу → offline.html.
- Standalone: запустить установленное приложение — открывается без браузерного интерфейса.
