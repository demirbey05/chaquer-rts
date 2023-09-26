import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ProtectedRoutes } from "./pages/ProtectedRoutes";
import { Menu } from "./pages/menu/index";
import { Game } from "./pages/game/index";
import { Spectator } from "./pages/spectator";
import { useGameState } from "./hooks/useGameState";
import { usePlayer } from "./context/PlayerContext";
import { usePlayerIsValid } from "./hooks/IdentityHooks/usePlayerIsValid";

export const App = () => {
  const gameState = useGameState(1);
  const { userWallet } = usePlayer();
  const isUserValid = usePlayerIsValid(1, userWallet);
  return (
    <>
      <Router>
        <Switch>
          <ProtectedRoutes isUserValid={isUserValid} component={Game} exact path="/game" />
          {
            gameState && (gameState === 3 || gameState === 4) && <Route component={Spectator} path="/game/spectator" />
          }
          <Route component={Menu} path="/" />
        </Switch>
      </Router >
    </>
  );
};
