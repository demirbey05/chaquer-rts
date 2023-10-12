import "tailwindcss/tailwind.css";
import './styles/globals.css'
import './styles/drawers.css'
import './styles/buttons.css'
import './styles/progressBars.css'
import './styles/hoverEffects.css'
import './styles/warnings.css';
import './styles/modals.css';
import './styles/animations.css';
import ReactDOM from "react-dom/client";
import mudConfig from "contracts/mud.config";
import { App } from "./App";
import { setup } from "./mud/setup";
import { MUDProvider } from "./context/MUDContext";
import { TerrainProvider } from "./context/TerrainContext";
import { ChakraProvider } from "@chakra-ui/react";
import { PlayerProvider } from './context/PlayerContext';
import { CastleProvider } from './context/CastleContext';
import { ArmyProvider } from "./context/ArmyContext";
import { AttackProvider } from "./context/AttackContext";
import { MineProvider } from "./context/MineContext";
import { ErrorProvider } from "./context/ErrorContext";
import { SeaProvider } from "./context/SeaContext";
import { FleetProvider } from './context/FleetContext';
import { GameProvider } from "./context/GameContext";

const rootElement = document.getElementById("react-root");
if (!rootElement) throw new Error("React root not found");
const root = ReactDOM.createRoot(rootElement);

// TODO: figure out if we actually want this to be async or if we should render something else in the meantime
setup().then(async (result) => {
  root.render(
    <MUDProvider value={result}>
      <ChakraProvider>
        <ErrorProvider>
          <GameProvider>
            <TerrainProvider>
              <AttackProvider>
                <SeaProvider>
                  <FleetProvider>
                    <MineProvider>
                      <ArmyProvider>
                        <CastleProvider>
                          <PlayerProvider>
                            <App />
                          </PlayerProvider>
                        </CastleProvider>
                      </ArmyProvider>
                    </MineProvider>
                  </FleetProvider>
                </SeaProvider>
              </AttackProvider>
            </TerrainProvider>
          </GameProvider>
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
      storedBlockLogs$: result.network.storedBlockLogs$,
      worldAddress: result.network.worldContract.address,
      worldAbi: result.network.worldContract.abi,
      write$: result.network.write$,
      recsWorld: result.network.world,
    });
  }
});
