import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ProtectedRoutes } from "./pages/ProtectedRoutes";
import { Menu } from "./pages/menu/index";
import { Game } from "./pages/game/index";
import { Spectator } from "./pages/spectator";
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
          <ProtectedRoutes isUserValid={isUserValid} component={Spectator} path="/spectator/:gameID" />
          <Route component={Menu} path="/" />
        </Switch>
      </Router >
    </>
  );
};
