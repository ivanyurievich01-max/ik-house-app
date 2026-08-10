import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl font-extrabold text-brand-500">404</div>
      <h1 className="mt-4 text-2xl font-extrabold text-ink">
        Страница не найдена
      </h1>
      <p className="mt-2 max-w-md text-ink-muted">
        Возможно, объект был снят с публикации или ссылка устарела. Давайте
        подберём что-нибудь другое на Иссык-Куле.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="btn-outline">
          На главную
        </Link>
        <Link href="/catalog" className="btn-primary">
          Смотреть жильё
        </Link>
      </div>
    </div>
  );
}
