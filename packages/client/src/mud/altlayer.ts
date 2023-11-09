import type { MUDChain } from "@latticexyz/common/chains";

export const altlayer = {
  name: "Chaquer-Rollup",
  id: 1400601,
  network: "chaquer2",
  nativeCurrency: { decimals: 18, name: "Nakama", symbol: "NKX" },
  rpcUrls: {
    default: {
      http: ["https://flashlayer.alt.technology/chaquer281c1962f"],
      webSocket: ["wss://flashlayer.alt.technology/chaquer281c1962f"],
    },
    public: {
      http: ["https://flashlayer.alt.technology/chaquer281c1962f"],
      webSocket: ["wss://flashlayer.alt.technology/chaquer281c1962f"],
    },
  },
  blockExplorers: {
    default: {
      name: "ChaquerExplorer",
      url: "https://chaquer281c1962f-explorer.alt.technology",
    },
  },
} as const satisfies MUDChain;