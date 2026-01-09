import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db"; // Наш инстанс drizzle
import { openAPI } from "better-auth/plugins"; // Опционально, удобно для сваггера

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // указываем диалект
  }),
  emailAndPassword: {
    enabled: true, // Включаем логин/пароль
  },
  // Важно для кук между разными портами (Nuxt:3000 -> API:3001)
  trustedOrigins: ["http://localhost:3000"], 
});