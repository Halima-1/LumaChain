import { Hono } from "hono";
import { WarrantyClient } from "@lumachain/sdk";
import { env } from "../lib/env.js";
import { badRequest, serverError } from "../lib/errors.js";

export const warrantyRouter = new Hono();

const getClient = (contractId: string) =>
  new WarrantyClient(contractId, env.network);

// ── GET /api/warranty/:contractId/claim/:index ────────────────────────────────
warrantyRouter.get("/:contractId/claim/:index", async (c) => {
  const { contractId, index } = c.req.param();
  const idx = parseInt(index, 10);
  if (isNaN(idx) || idx < 0) return badRequest(c, "index must be a non-negative integer");
  try {
    const claim = await getClient(contractId).getClaim(idx);
    return c.json(claim);
  } catch (err) {
    return serverError(c, err);
  }
});
