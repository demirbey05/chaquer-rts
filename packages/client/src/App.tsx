import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ProtectedRoutes } from "./pages/ProtectedRoutes";
import { Menu } from "./pages/menu/index";
import { Game } from "./pages/game/index";
import { Spectator } from "./pages/spectator";
import { useGameState } from "./hooks/useGameState";
import { usePlayer } from "./context/PlayerContext";
import { usePlayerIsValid } from "./hooks/IdentityHooks/usePlayerIsValid";
import { useGame } from "./context/GameContext";

export const App = () => {
  const { userWallet } = usePlayer();
  const { gameID } = useGame();
  const isUserValid = usePlayerIsValid(gameID, userWallet);

  return (
    <>
      <Router>
        <Switch>
          <ProtectedRoutes isUserValid={isUserValid} component={Game} path="/game/:gameID" />
          <Route component={Spectator} path="/game/spectator" />
          <Route component={Menu} path="/" />
        </Switch>
      </Router >
    </>
  );
};
