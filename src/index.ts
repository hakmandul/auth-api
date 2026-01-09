import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth";

const app = new Hono();

// 1. Настройка CORS (КРИТИЧНО для Nuxt)
// Nuxt (frontend) будет стучаться с localhost:3000
app.use(
  "/api/*",
  cors({
    origin: ["http://localhost:3000"], // Адрес твоего Nuxt приложения
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true, // ОБЯЗАТЕЛЬНО true, чтобы передавались куки сессии
  })
);

// 2. Монтируем Better-Auth
// Better-auth обрабатывает запросы на /api/auth/*
app.on(["POST", "GET"], "/api/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

// 3. Пример защищенного роута
app.get("/api/me", async (c) => {
    const session = await auth.api.getSession({
        headers: c.req.raw.headers
    });

    if (!session) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    return c.json({ 
        message: "Hello user!", 
        user: session.user 
    });
});

export default {
    port: 3001, // Запускаем бэкенд на порту 3001
    fetch: app.fetch,
}