import { describe, it, expect } from "vitest";
import app from "./index.js";

describe("API endpoints", () => {
  it("should return ok on /", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ name: "LumaChain API", version: "0.1.0", status: "ok" });
  });

  it("should return 404 for unknown route", async () => {
    const res = await app.request("/unknown-route");
    expect(res.status).toBe(404);
  });
});
