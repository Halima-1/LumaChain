import {
  Contract,
  nativeToScVal,
  scValToNative,
  Address,
  type Keypair,
} from "@stellar/stellar-sdk";
import type { SorobanRpc } from "@stellar/stellar-sdk";
import { getSorobanClient, buildAndSubmitTx, type NetworkName } from "../client.js";

export interface ClaimRecord {
  submitter: string;
  serialNumber: string;
  description: string;
  ipfsPhotoHash: Uint8Array;
  status: "OPEN" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  filedAt: bigint;
  resolvedAt: bigint;
}

export class WarrantyClient {
  private contract: Contract;
  private server: SorobanRpc.Server;
  private network: NetworkName;

  constructor(contractId: string, network: NetworkName) {
    this.contract = new Contract(contractId);
    this.server = getSorobanClient(network);
    this.network = network;
  }

  async init(minterKeypair: Keypair, expiry: bigint): Promise<void> {
    const op = this.contract.call(
      "init",
      new Address(minterKeypair.publicKey()).toScVal(),
      nativeToScVal(expiry, { type: "u64" })
    );
    await buildAndSubmitTx(this.server, op, minterKeypair, this.network);
  }

  async fileClaim(
    submitterKeypair: Keypair,
    serialNumber: string,
    description: string,
    ipfsPhotoHash: Uint8Array
  ): Promise<void> {
    const op = this.contract.call(
      "file_claim",
      new Address(submitterKeypair.publicKey()).toScVal(),
      nativeToScVal(serialNumber, { type: "string" }),
      nativeToScVal(description, { type: "string" }),
      nativeToScVal(ipfsPhotoHash, { type: "bytes" })
    );
    await buildAndSubmitTx(this.server, op, submitterKeypair, this.network);
  }

  async resolveClaim(
    minterKeypair: Keypair,
    claimIndex: number,
    status: "APPROVED" | "REJECTED" | "UNDER_REVIEW"
  ): Promise<void> {
    const op = this.contract.call(
      "resolve_claim",
      nativeToScVal(claimIndex, { type: "u32" }),
      nativeToScVal(status, { type: "symbol" })
    );
    await buildAndSubmitTx(this.server, op, minterKeypair, this.network);
  }

  async getClaim(claimIndex: number): Promise<ClaimRecord> {
    const op = this.contract.call(
      "get_claim",
      nativeToScVal(claimIndex, { type: "u32" })
    );
    const sim = await this.server.simulateTransaction(
      await this._readTx(op)
    );
    if ("error" in sim) throw new Error((sim as any).error);
    const raw = scValToNative((sim as any).result!.retval);
    return {
      submitter: raw.submitter,
      serialNumber: raw.serial_number,
      description: raw.description,
      ipfsPhotoHash: raw.ipfs_photo_hash,
      status: raw.status,
      filedAt: raw.filed_at,
      resolvedAt: raw.resolved_at,
    };
  }

  async getClaimsCount(): Promise<number> {
    const op = this.contract.call("get_claims_count");
    const sim = await this.server.simulateTransaction(
      await this._readTx(op)
    );
    if ("error" in sim) throw new Error((sim as any).error);
    return scValToNative((sim as any).result!.retval) as number;
  }

  private async _readTx(op: any): Promise<any> {
    const { TransactionBuilder, Networks, BASE_FEE, Keypair } = await import(
      "@stellar/stellar-sdk"
    );
    const kp = Keypair.random();
    const dummyAccount = {
      accountId: () => kp.publicKey(),
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
