import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { logger } from "@hono/hono/logger";
import postgres from "postgres";
import { redisCacheMiddleware } from "./redis-cache-middleware.js";

const app = new Hono();
const sql = postgres();

app.use("/*", cors());
app.use("/*", logger());

app.get("/", (c) => c.json({ message: "Hello world!" }));
app.get("/todos", async (c) => {
  const todos = await sql`SELECT * FROM todos`;
  return c.json(todos);
});

app.post("/users", async (c) => {
  const { name } = await c.req.json();
  await sql`INSERT INTO users (name) VALUES (${name})`;
  c.status(202);
  return c.body("Accepted");
});

app.get("/hello/*", redisCacheMiddleware);

app.get("/hello/:name", async (c) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return c.json({ message: `Hello ${c.req.param("name")}!` });
});

export default app;
