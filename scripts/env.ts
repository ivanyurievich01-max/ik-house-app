import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

/** Простая загрузка .env.local / .env без внешних зависимостей */
export function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    const path = resolve(process.cwd(), file);
    if (!existsSync(path)) continue;
    const lines = readFileSync(path, "utf8").split("\n");
    for (const line of lines) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      const key = m[1];
      let value = m[2];
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = value;
    }
  }
}

export function requireEnv(name: string, fallbackName?: string): string {
  const v =
    process.env[name] ?? (fallbackName ? process.env[fallbackName] : undefined);
  if (!v) {
    console.error(
      `❌ Не задана переменная окружения ${name}. Заполните .env.local (см. .env.example).`,
    );
    process.exit(1);
  }
  return v;
}
