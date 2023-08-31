import "tailwindcss/tailwind.css";
import "react-toastify/dist/ReactToastify.css";
import ReactDOM from "react-dom/client";
import mudConfig from "contracts/mud.config";
import { App } from "./App";
import { setup } from "./mud/setup";
import { MUDProvider } from "./MUDContext";
import { TerrainProvider } from "./context/TerrainContext";
import { ChakraProvider } from "@chakra-ui/react";
import { PlayerProvider } from './context/PlayerContext';
import { CastleProvider } from './context/CastleContext';
import { ArmyProvider } from "./context/ArmyContext";
import { AttackProvider } from "./context/AttackContext";
import { MineProvider } from "./context/MineContext";
import { ErrorProvider } from "./context/ErrorContext";

const rootElement = document.getElementById("react-root");
if (!rootElement) throw new Error("React root not found");
const root = ReactDOM.createRoot(rootElement);

// TODO: figure out if we actually want this to be async or if we should render something else in the meantime
setup().then(async (result) => {
  root.render(
    <MUDProvider value={result}>
      <ChakraProvider>
        <ErrorProvider>
          <TerrainProvider>
            <AttackProvider>
              <MineProvider>
                <ArmyProvider>
                  <CastleProvider>
                    <PlayerProvider>
                      <App />
                    </PlayerProvider>
                  </CastleProvider>
                </ArmyProvider>
              </MineProvider>
            </AttackProvider>
          </TerrainProvider>
        </ErrorProvider>
      </ChakraProvider>
    </MUDProvider >
  );

  if (import.meta.env.DEV) {
    const { mount: mountDevTools } = await import("@latticexyz/dev-tools");
    mountDevTools({
      config: mudConfig,
      publicClient: result.network.publicClient,
      walletClient: result.network.walletClient,
      latestBlock$: result.network.latestBlock$,
      blockStorageOperations$: result.network.blockStorageOperations$,
      worldAddress: result.network.worldContract.address,
      worldAbi: result.network.worldContract.abi,
      write$: result.network.write$,
      recsWorld: result.network.world
    });
  }
});
