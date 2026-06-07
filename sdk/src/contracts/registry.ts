import {
  Contract,
  nativeToScVal,
  scValToNative,
  Address,
} from "@stellar/stellar-sdk";
import type { SorobanRpc } from "@stellar/stellar-sdk";
import { getSorobanClient, buildAndSubmitTx, type NetworkName } from "../client.js";
import type { Keypair } from "@stellar/stellar-sdk";

export class RegistryClient {
  private contract: Contract;
  private server: SorobanRpc.Server;
  private network: NetworkName;

  constructor(contractId: string, network: NetworkName) {
    this.contract = new Contract(contractId);
    this.server = getSorobanClient(network);
    this.network = network;
  }

  async init(adminKeypair: Keypair): Promise<void> {
    const op = this.contract.call(
      "init",
      new Address(adminKeypair.publicKey()).toScVal()
    );
    await buildAndSubmitTx(this.server, op, adminKeypair, this.network);
  }

  async registerAsset(
    adminKeypair: Keypair,
    assetContractId: string,
    serial: string,
    productType: string,
    ownerAddress: string
  ): Promise<void> {
    const op = this.contract.call(
      "register_asset",
      new Address(assetContractId).toScVal(),
      nativeToScVal(serial, { type: "string" }),
      nativeToScVal(productType, { type: "symbol" }),
      new Address(ownerAddress).toScVal()
    );
    await buildAndSubmitTx(this.server, op, adminKeypair, this.network);
  }

  async getAssetBySerial(serial: string): Promise<string> {
    const op = this.contract.call(
      "get_asset_by_serial",
      nativeToScVal(serial, { type: "string" })
    );
    const sim = await this.server.simulateTransaction(
      await this._readTx(op)
    );
    if ("error" in sim) throw new Error((sim as any).error);
    return scValToNative((sim as any).result!.retval) as string;
  }

  async getAssetsByOwner(ownerAddress: string): Promise<string[]> {
    const op = this.contract.call(
      "get_assets_by_owner",
      new Address(ownerAddress).toScVal()
    );
    const sim = await this.server.simulateTransaction(
      await this._readTx(op)
    );
    if ("error" in sim) throw new Error((sim as any).error);
    return scValToNative((sim as any).result!.retval) as string[];
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
