import QRCode from "qrcode";

// ---- QR payload schema (v1) ----

export interface QRPayload {
  v: 1;
  net: "testnet" | "mainnet";
  cid: string;       // 56-char Soroban contract address
  serial: string;
  type: "INVERTER" | "BATTERY" | "PANEL";
}

// ---- Generation ----

/**
 * Encodes a QR payload to base64url JSON and generates a QR PNG buffer.
 */
export async function generateAssetQR(
  contractId: string,
  serial: string,
  productType: QRPayload["type"],
  network: QRPayload["net"] = "testnet"
): Promise<Buffer> {
  const payload: QRPayload = {
    v: 1,
    net: network,
    cid: contractId,
    serial,
    type: productType,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return QRCode.toBuffer(encoded, {
    errorCorrectionLevel: "M",
    margin: 2,
    scale: 6,
  });
}

/**
 * Generates an SVG QR code string (useful for embedding in HTML/PDF).
 */
export async function generateAssetQRSvg(
  contractId: string,
  serial: string,
  productType: QRPayload["type"],
  network: QRPayload["net"] = "testnet"
): Promise<string> {
  const payload: QRPayload = {
    v: 1,
    net: network,
    cid: contractId,
    serial,
    type: productType,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return QRCode.toString(encoded, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 2,
  });
}

// ---- Parsing ----

/**
 * Decodes a raw scanned string (base64url-encoded JSON) into a typed QRPayload.
 * Throws if the payload format is invalid or version is unsupported.
 */
export function parseQRPayload(raw: string): QRPayload {
  let decoded: unknown;
  try {
    const json = Buffer.from(raw, "base64url").toString("utf-8");
    decoded = JSON.parse(json);
  } catch {
    throw new Error(`QR decode failed: invalid base64url or JSON — "${raw}"`);
  }

  const p = decoded as Record<string, unknown>;
  if (p["v"] !== 1) {
    throw new Error(`Unsupported QR payload version: ${p["v"]}`);
  }
  if (typeof p["cid"] !== "string" || p["cid"].length !== 56) {
    throw new Error(`Invalid contract ID in QR payload`);
  }
  if (!["testnet", "mainnet"].includes(p["net"] as string)) {
    throw new Error(`Invalid network in QR payload: ${p["net"]}`);
  }
  if (!["INVERTER", "BATTERY", "PANEL"].includes(p["type"] as string)) {
    throw new Error(`Invalid product type in QR payload: ${p["type"]}`);
  }

  return {
    v: 1,
    net: p["net"] as QRPayload["net"],
    cid: p["cid"] as string,
    serial: p["serial"] as string,
    type: p["type"] as QRPayload["type"],
  };
}

// ---- Browser scanner (lazy-loads @zxing/library) ----

/**
 * Starts a live QR scanner on the given <video> element.
 * Calls onResult with each decoded QRPayload. Returns a stop function.
 * Safe to use in Next.js client components (dynamic import).
 */
export async function startBrowserScanner(
  videoElementId: string,
  onResult: (payload: QRPayload) => void,
  onError?: (err: Error) => void
): Promise<() => void> {
  const { BrowserQRCodeReader } = await import("@zxing/library");
  const reader = new BrowserQRCodeReader();

  reader.decodeFromVideoDevice(null, videoElementId, (result, err) => {
    if (result) {
      try {
        const payload = parseQRPayload(result.getText());
        onResult(payload);
      } catch (parseErr) {
        onError?.(parseErr as Error);
      }
    }
    if (err && !(err.name === "NotFoundException")) {
      onError?.(new Error(err.message));
    }
  });

  return () => reader.reset();
}
