/**
 * Назначение роли admin существующему пользователю.
 *
 * 1) Зарегистрируйтесь на сайте обычным способом и подтвердите email.
 * 2) Запустите: npm run create-admin -- your-email@example.com
 *
 * Требует SUPABASE_SERVICE_ROLE_KEY в .env.local (только на сервере разработчика,
 * НИКОГДА не коммитьте этот ключ).
 */
import { createClient } from "@supabase/supabase-js";
import { loadEnv, requireEnv } from "./env";

loadEnv();

const email = process.argv[2];
if (!email) {
  console.error("Использование: npm run create-admin -- email@example.com");
  process.exit(1);
}

const db = createClient(
  requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
  requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
  { auth: { persistSession: false } },
);

async function main() {
  const { data: list, error } = await db.auth.admin.listUsers({
    perPage: 1000,
  });
  if (error) throw error;
  const user = list.users.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase(),
  );
  if (!user) {
    console.error(
      `❌ Пользователь ${email} не найден. Сначала зарегистрируйтесь на сайте.`,
    );
    process.exit(1);
  }
  const { error: upErr } = await db
    .from("profiles")
    .update({ role: "admin" })
    .eq("id", user.id);
  if (upErr) throw upErr;
  console.log(`✅ ${email} теперь администратор IK-HOUSE.`);
}

main().catch((e) => {
  console.error("❌ Ошибка:", e);
  process.exit(1);
});
