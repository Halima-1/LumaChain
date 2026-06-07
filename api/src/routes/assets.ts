import { Hono } from "hono";
import { SolarAssetClient } from "@lumachain/sdk";
import { env } from "../lib/env.js";
import { badRequest, serverError } from "../lib/errors.js";

export const assetsRouter = new Hono();

// ── GET /api/assets/:contractId/metadata ─────────────────────────────────────
assetsRouter.get("/:contractId/metadata", async (c) => {
  const contractId = c.req.param("contractId");
  try {
    const client = new SolarAssetClient(contractId, env.network);
    const metadata = await client.getMetadata();
    return c.json(metadata);
  } catch (err) {
    return serverError(c, err);
  }
});

// ── GET /api/assets/:contractId/owner ─────────────────────────────────────────
assetsRouter.get("/:contractId/owner", async (c) => {
  const contractId = c.req.param("contractId");
  try {
    const client = new SolarAssetClient(contractId, env.network);
    const owner = await client.getOwner();
    return c.json(owner);
  } catch (err) {
    return serverError(c, err);
  }
});

// ── GET /api/assets/:contractId/history ───────────────────────────────────────
assetsRouter.get("/:contractId/history", async (c) => {
  const contractId = c.req.param("contractId");
  try {
    const client = new SolarAssetClient(contractId, env.network);
    const count = await client.getHistoryCount();
    const history = await Promise.all(
      Array.from({ length: count }, (_, i) => client.getHistoryAt(i))
    );
    return c.json({ count, history });
  } catch (err) {
    return serverError(c, err);
  }
});

// ── GET /api/assets/:contractId/verify?serial=SN123 ──────────────────────────
assetsRouter.get("/:contractId/verify", async (c) => {
  const contractId = c.req.param("contractId");
  const serial = c.req.query("serial");
  if (!serial) return badRequest(c, "Query param ?serial= is required");
  try {
    const client = new SolarAssetClient(contractId, env.network);
    const authentic = await client.verify(serial);
    return c.json({ authentic, serial, contractId });
  } catch (err) {
    return serverError(c, err);
  }
});

// ── GET /api/assets/:contractId/qr ────────────────────────────────────────────
// Returns the QR payload JSON (browser will render its own QR)
assetsRouter.get("/:contractId/qr", async (c) => {
  const contractId = c.req.param("contractId");
  try {
    const client = new SolarAssetClient(contractId, env.network);
    const meta = await client.getMetadata();
    return c.json({
      v: 1,
      net: env.network,
      cid: contractId,
      serial: meta.serialNumber,
      type: meta.productType,
    });
  } catch (err) {
    return serverError(c, err);
  }
});
