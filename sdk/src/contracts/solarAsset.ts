import {
  Contract,
  Keypair,
  nativeToScVal,
  scValToNative,
  xdr,
  Address,
} from "@stellar/stellar-sdk";
import type { SorobanRpc } from "@stellar/stellar-sdk";
import { getSorobanClient, buildAndSubmitTx, type NetworkName } from "../client.js";

// ---- Mirrored TypeScript types from Rust structs ----

export interface AssetMetadata {
  serialNumber: string;
  productType: "INVERTER" | "BATTERY" | "PANEL";
  manufacturer: string;
  model: string;
  manufactureDate: bigint; // u64 as bigint
  ratedPowerW: number;     // u32
  ipfsSpecHash: Uint8Array;
}

export interface OwnershipRecord {
  owner: string;           // Stellar address
  role: string;            // SUPPLIER | WAREHOUSE | INSTALLER | CUSTOMER
  transferredAt: bigint;
  locationHash: Uint8Array;
  notes: string;
}

// ---- XDR helpers ----

function metadataToScVal(meta: AssetMetadata): xdr.ScVal {
  return nativeToScVal(
    {
      serial_number: meta.serialNumber,
      product_type: meta.productType,
      manufacturer: meta.manufacturer,
      model: meta.model,
      manufacture_date: meta.manufactureDate,
      rated_power_w: meta.ratedPowerW,
      ipfs_spec_hash: meta.ipfsSpecHash,
    },
    { type: "struct" }
  );
}

// ---- Contract client ----

export class SolarAssetClient {
  private contract: Contract;
  private server: SorobanRpc.Server;
  private network: NetworkName;

  constructor(contractId: string, network: NetworkName) {
    this.contract = new Contract(contractId);
    this.server = getSorobanClient(network);
    this.network = network;
  }

  async mint(
    minterKeypair: Keypair,
    metadata: AssetMetadata
  ): Promise<void> {
    const op = this.contract.call(
      "mint",
      new Address(minterKeypair.publicKey()).toScVal(),
      metadataToScVal(metadata)
    );
    await buildAndSubmitTx(this.server, op, minterKeypair, this.network);
  }

  async transfer(
    currentOwnerKeypair: Keypair,
    to: string,
    role: string,
    locationHash: Uint8Array,
    notes: string
  ): Promise<void> {
    const op = this.contract.call(
      "transfer",
      new Address(to).toScVal(),
      nativeToScVal(role, { type: "symbol" }),
      nativeToScVal(locationHash, { type: "bytes" }),
      nativeToScVal(notes, { type: "string" })
    );
    await buildAndSubmitTx(this.server, op, currentOwnerKeypair, this.network);
  }

  async getMetadata(): Promise<AssetMetadata> {
    const op = this.contract.call("get_metadata");
    const sim = await this.server.simulateTransaction(
      // Build a read-only tx (no signing needed for simulations)
      await this._buildReadTx(op)
    );
    if ("error" in sim) throw new Error(sim.error);
    const raw = scValToNative((sim as any).result!.retval);
    return {
      serialNumber: raw.serial_number,
      productType: raw.product_type,
      manufacturer: raw.manufacturer,
      model: raw.model,
      manufactureDate: raw.manufacture_date,
      ratedPowerW: raw.rated_power_w,
      ipfsSpecHash: raw.ipfs_spec_hash,
    };
  }

  async getOwner(): Promise<OwnershipRecord> {
    const op = this.contract.call("get_owner");
    const sim = await this.server.simulateTransaction(
      await this._buildReadTx(op)
    );
    if ("error" in sim) throw new Error((sim as any).error);
    const raw = scValToNative((sim as any).result!.retval);
    return {
      owner: raw.owner,
      role: raw.role,
      transferredAt: raw.transferred_at,
      locationHash: raw.location_hash,
      notes: raw.notes,
    };
  }

  async getHistoryCount(): Promise<number> {
    const op = this.contract.call("get_history_count");
    const sim = await this.server.simulateTransaction(
      await this._buildReadTx(op)
    );
    if ("error" in sim) throw new Error((sim as any).error);
    return scValToNative((sim as any).result!.retval) as number;
  }

  async getHistoryAt(index: number): Promise<OwnershipRecord> {
    const op = this.contract.call(
      "get_history_at",
      nativeToScVal(index, { type: "u32" })
    );
    const sim = await this.server.simulateTransaction(
      await this._buildReadTx(op)
    );
    if ("error" in sim) throw new Error((sim as any).error);
    const raw = scValToNative((sim as any).result!.retval);
    return {
      owner: raw.owner,
      role: raw.role,
      transferredAt: raw.transferred_at,
      locationHash: raw.location_hash,
      notes: raw.notes,
    };
  }

  async verify(serial: string): Promise<boolean> {
    const op = this.contract.call(
      "verify",
      nativeToScVal(serial, { type: "string" })
    );
    const sim = await this.server.simulateTransaction(
      await this._buildReadTx(op)
    );
    if ("error" in sim) throw new Error((sim as any).error);
    return scValToNative((sim as any).result!.retval) as boolean;
  }

  private async _buildReadTx(op: xdr.Operation): Promise<any> {
    // For read-only simulations we can use any funded account as the source
    // — in practice, use a dummy keypair or the app's server keypair
    const { TransactionBuilder, Networks, BASE_FEE, Keypair } = await import(
      "@stellar/stellar-sdk"
    );
    const dummy = Keypair.random();
    // We can't actually fetch account for a random key; supply a known public key
    // or use the horizon friendbot endpoint.
    // For read-only simulations, stellar-sdk allows a minimal account object:
    const dummyAccount = {
      accountId: () => dummy.publicKey(),
      sequenceNumber: () => "0",
      incrementSequenceNumber: () => {},
    } as any;

    return new TransactionBuilder(dummyAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(op)
      .setTimeout(30)
      .build();
  }
}
