import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth";

// Лучшая практика: используем basePath, если Nginx проксирует /api на этот сервис
// Если в Nginx: location /api/ { proxy_pass ... } передает полный путь, то Hono должен ожидать /api
const app = new Hono().basePath('/api');

// 1. Настройка CORS
app.use(
  "/*", // Применяем ко всем роутам внутри basePath
  cors({
    // В продакшене это ваш домен. В разработке - localhost.
    origin: [
        process.env.FRONTEND_URL || "https://your-site.com", 
        "http://localhost:3000" // Оставляем для локальной разработки
    ],
    allowHeaders: ["Content-Type", "Authorization", "Cookie"], // Cookie важно для сессий
    allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

// 2. Монтируем Better-Auth
// Теперь путь будет /api/auth/** автоматически из-за basePath('/api')
app.on(["POST", "GET"], "/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

// 3. Защищенный роут
// Путь станет: /api/me
app.get("/me", async (c) => {
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
    // Берем порт из .env или ставим 3001 по умолчанию
    port: process.env.PORT || 3001, 
    fetch: app.fetch,
}