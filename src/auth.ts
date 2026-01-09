import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db"; 

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  
  emailAndPassword: {
    enabled: true,
  },

  // 1. Секрет (Обязательно задайте в .env)
  secret: process.env.BETTER_AUTH_SECRET,

  // 2. Базовый URL авторизации (КРИТИЧНО для редиректов и email-ссылок)
  // Локально: http://localhost:3000/api/auth (или порт 3001, где Hono)
  // Продакшен: https://your-site.com/api/auth
  baseURL: process.env.BETTER_AUTH_URL,

  // 3. Доверенные домены (CORS / CSRF)
  // Better-auth проверит, совпадает ли Origin запроса с этим списком
  trustedOrigins: [
    process.env.FRONTEND_URL || "https://your-site.com", // Ваш реальный домен
    "http://localhost:3000", // Для локальной разработки Nuxt
  ],
});