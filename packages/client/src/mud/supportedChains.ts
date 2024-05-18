import {
  MUDChain,
  latticeTestnet,
  mudFoundry,
} from "@latticexyz/common/chains";
import { altlayer } from "./altlayer";

// If you are deploying to chains other than anvil or Lattice testnet, add them here
latticeTestnet.rpcUrls.default.http=["https://miner.testnet-chain.linfra.xyz/"]
latticeTestnet.rpcUrls.default.webSocket=["wss://miner.testnet-chain.linfra.xyz/"]
const latticeTestnetZeroFee = {
  ...latticeTestnet,
  fees:{
    defaultPriorityFee: 0n,
  },
} as const satisfies MUDChain
export const supportedChains: MUDChain[] = [mudFoundry, latticeTestnetZeroFee,altlayer];
