import { providers } from "ethers";

export async function getErrorLog(
  txhash: string,
  provider: providers.BaseProvider
): Promise<string> {
  const tx = await provider.getTransaction(txhash);
  tx.gasPrice = undefined; // tx object contains both gasPrice and maxFeePerGas
  const encodedRevertReason = await provider.call(
    tx as providers.TransactionRequest
  );
  return encodedRevertReason;
}
