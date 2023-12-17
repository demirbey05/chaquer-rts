import {
  MUDChain,
  latticeTestnet,
  mudFoundry,
} from "@latticexyz/common/chains";
import { altlayer } from "./altlayer";

// If you are deploying to chains other than anvil or Lattice testnet, add them here
latticeTestnet.rpcUrls.default.http=["https://miner.testnet-chain.linfra.xyz/"]
latticeTestnet.rpcUrls.default.webSocket=["wss://miner.testnet-chain.linfra.xyz/"]
export const supportedChains: MUDChain[] = [mudFoundry, latticeTestnet,altlayer];
