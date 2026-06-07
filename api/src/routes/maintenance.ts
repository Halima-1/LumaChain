import { Hono } from "hono";
import { MaintenanceLogClient } from "@lumachain/sdk";
import { env } from "../lib/env.js";
import { badRequest, serverError } from "../lib/errors.js";

export const maintenanceRouter = new Hono();

const getClient = (contractId: string) =>
  new MaintenanceLogClient(contractId, env.network);

// ── GET /api/maintenance/:contractId/count ────────────────────────────────────
maintenanceRouter.get("/:contractId/count", async (c) => {
  const { contractId } = c.req.param();
  try {
    const count = await getClient(contractId).getLogCount();
    return c.json({ contractId, count });
  } catch (err) {
    return serverError(c, err);
  }
});

// ── GET /api/maintenance/:contractId/log/:index ───────────────────────────────
maintenanceRouter.get("/:contractId/log/:index", async (c) => {
  const { contractId, index } = c.req.param();
  const idx = parseInt(index, 10);
  if (isNaN(idx) || idx < 0) return badRequest(c, "index must be a non-negative integer");
  try {
    const entry = await getClient(contractId).getLogEntry(idx);
    return c.json(entry);
  } catch (err) {
    return serverError(c, err);
  }
});

// ── GET /api/maintenance/:contractId/logs ─────────────────────────────────────
// Fetches all log entries (use sparingly on large logs)
maintenanceRouter.get("/:contractId/logs", async (c) => {
  const { contractId } = c.req.param();
  try {
    const client = getClient(contractId);
    const count = await client.getLogCount();
    const entries = await Promise.all(
      Array.from({ length: count }, (_, i) => client.getLogEntry(i))
    );
    return c.json({ contractId, count, entries });
  } catch (err) {
    return serverError(c, err);
  }
});
