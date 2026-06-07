import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";

import { assetsRouter } from "./routes/assets.js";
import { registryRouter } from "./routes/registry.js";
import { warrantyRouter } from "./routes/warranty.js";
import { maintenanceRouter } from "./routes/maintenance.js";

const app = new Hono();

// ── Global middleware ──────────────────────────────────────────────────────────
app.use("*", logger());
app.use("*", cors({ origin: process.env.CORS_ORIGIN ?? "*" }));
app.use("*", prettyJSON());

// ── Routes ────────────────────────────────────────────────────────────────────
app.get("/", (c) =>
  c.json({ name: "LumaChain API", version: "0.1.0", status: "ok" })
);

app.route("/api/assets", assetsRouter);
app.route("/api/registry", registryRouter);
app.route("/api/warranty", warrantyRouter);
app.route("/api/maintenance", maintenanceRouter);

// ── Not-found & Error handlers ─────────────────────────────────────────────────
app.notFound((c) => c.json({ error: "Not Found" }, 404));
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: err.message }, 500);
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT ?? 3001);
serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`🚀  LumaChain API running on http://localhost:${PORT}`);
});

export default app;
