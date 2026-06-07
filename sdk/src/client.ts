import {
  SorobanRpc,
  Networks,
  TransactionBuilder,
  BASE_FEE,
  Contract,
  Keypair,
  Transaction,
  xdr,
} from "@stellar/stellar-sdk";

export const NETWORK_CONFIG = {
  testnet: {
    rpcUrl: "https://soroban-testnet.stellar.org",
    networkPassphrase: Networks.TESTNET,
    horizonUrl: "https://horizon-testnet.stellar.org",
  },
  mainnet: {
    rpcUrl: "https://soroban-mainnet.stellar.org",
    networkPassphrase: Networks.PUBLIC,
    horizonUrl: "https://horizon.stellar.org",
  },
} as const;

export type NetworkName = keyof typeof NETWORK_CONFIG;

export function getSorobanClient(network: NetworkName): SorobanRpc.Server {
  return new SorobanRpc.Server(NETWORK_CONFIG[network].rpcUrl, {
    allowHttp: false,
  });
}

export async function buildAndSubmitTx(
  server: SorobanRpc.Server,
  operation: xdr.Operation,
  signerKeypair: Keypair,
  network: NetworkName
): Promise<SorobanRpc.Api.GetTransactionResponse> {
  const account = await server.getAccount(signerKeypair.publicKey());
  const networkPassphrase = NETWORK_CONFIG[network].networkPassphrase;

  let tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase,
  })
    .addOperation(operation)
    .setTimeout(30)
    .build();

  // Simulate to get the resource fee / footprint
  const simResult = await server.simulateTransaction(tx);
  if (SorobanRpc.Api.isSimulationError(simResult)) {
    throw new Error(`Simulation failed: ${simResult.error}`);
  }

  // Assemble and sign
  const assembled = SorobanRpc.assembleTransaction(tx, simResult).build();
  assembled.sign(signerKeypair);

  // Submit
  const sendResult = await server.sendTransaction(assembled);
  if (sendResult.status === "ERROR") {
    throw new Error(`Send failed: ${JSON.stringify(sendResult.errorResult)}`);
  }

  // Poll for confirmation
  let getResult: SorobanRpc.Api.GetTransactionResponse;
  const hash = sendResult.hash;
  for (let i = 0; i < 20; i++) {
    await sleep(1500);
    getResult = await server.getTransaction(hash);
    if (getResult.status !== SorobanRpc.Api.GetTransactionStatus.NOT_FOUND) {
      if (getResult.status === SorobanRpc.Api.GetTransactionStatus.FAILED) {
        throw new Error(
          `Transaction failed: ${JSON.stringify(getResult.resultMetaXdr)}`
        );
      }
      return getResult;
    }
  }
  throw new Error(`Transaction ${hash} not confirmed after 30s`);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
