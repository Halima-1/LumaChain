import {
  Contract,
  nativeToScVal,
  scValToNative,
  Address,
  type Keypair,
} from "@stellar/stellar-sdk";
import type { SorobanRpc } from "@stellar/stellar-sdk";
import { getSorobanClient, buildAndSubmitTx, type NetworkName } from "../client.js";

export interface MaintenanceEntry {
  technician: string;
  date: bigint;
  entryType: string;
  notes: string;
  ipfsPhotoHash: Uint8Array;
}

export class MaintenanceLogClient {
  private contract: Contract;
  private server: SorobanRpc.Server;
  private network: NetworkName;

  constructor(contractId: string, network: NetworkName) {
    this.contract = new Contract(contractId);
    this.server = getSorobanClient(network);
    this.network = network;
  }

  async init(ownerKeypair: Keypair): Promise<void> {
    const op = this.contract.call(
      "init",
      new Address(ownerKeypair.publicKey()).toScVal()
    );
    await buildAndSubmitTx(this.server, op, ownerKeypair, this.network);
  }

  async setOwner(
    currentOwnerKeypair: Keypair,
    newOwner: string
  ): Promise<void> {
    const op = this.contract.call(
      "set_owner",
      new Address(currentOwnerKeypair.publicKey()).toScVal(),
      new Address(newOwner).toScVal()
    );
    await buildAndSubmitTx(this.server, op, currentOwnerKeypair, this.network);
  }

  async addLog(
    ownerKeypair: Keypair,
    technician: string,
    entryType: string,
    notes: string,
    ipfsPhotoHash: Uint8Array
  ): Promise<void> {
    const op = this.contract.call(
      "add_log",
      new Address(technician).toScVal(),
      nativeToScVal(entryType, { type: "symbol" }),
      nativeToScVal(notes, { type: "string" }),
      nativeToScVal(ipfsPhotoHash, { type: "bytes" })
    );
    await buildAndSubmitTx(this.server, op, ownerKeypair, this.network);
  }

  async getLogCount(): Promise<number> {
    const op = this.contract.call("get_log_count");
    const sim = await this.server.simulateTransaction(
      await this._readTx(op)
    );
    if ("error" in sim) throw new Error((sim as any).error);
    return scValToNative((sim as any).result!.retval) as number;
  }

  async getLogEntry(index: number): Promise<MaintenanceEntry> {
    const op = this.contract.call(
      "get_log_entry",
      nativeToScVal(index, { type: "u32" })
    );
    const sim = await this.server.simulateTransaction(
      await this._readTx(op)
    );
    if ("error" in sim) throw new Error((sim as any).error);
    const raw = scValToNative((sim as any).result!.retval);
    return {
      technician: raw.technician,
      date: raw.date,
      entryType: raw.entry_type,
      notes: raw.notes,
      ipfsPhotoHash: raw.ipfs_photo_hash,
    };
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
