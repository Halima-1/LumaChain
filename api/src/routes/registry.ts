import { Hono } from "hono";
import { RegistryClient } from "@lumachain/sdk";
import { env } from "../lib/env.js";
import { badRequest, serverError } from "../lib/errors.js";

export const registryRouter = new Hono();

const getClient = () =>
  new RegistryClient(env.registryContractId, env.network);

// ── GET /api/registry/serial/:serial ──────────────────────────────────────────
registryRouter.get("/serial/:serial", async (c) => {
  const serial = c.req.param("serial");
  try {
    const contractId = await getClient().getAssetBySerial(serial);
    return c.json({ serial, contractId });
  } catch (err) {
    return serverError(c, err);
  }
});

// ── GET /api/registry/owner/:address ──────────────────────────────────────────
registryRouter.get("/owner/:address", async (c) => {
  const address = c.req.param("address");
  try {
    const assets = await getClient().getAssetsByOwner(address);
    return c.json({ owner: address, assets, count: assets.length });
  } catch (err) {
    return serverError(c, err);
  }
});
