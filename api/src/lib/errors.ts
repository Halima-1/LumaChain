import type { Context } from "hono";

export function badRequest(c: Context, message: string) {
  return c.json({ error: message }, 400);
}

export function notFound(c: Context, message = "Resource not found") {
  return c.json({ error: message }, 404);
}

export function serverError(c: Context, err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  console.error("[API Error]", message);
  return c.json({ error: message }, 500);
}
