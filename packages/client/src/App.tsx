import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedGame } from './pages/ProtectedRoutes/ProtectedGame'
import { ProtectedSpectator } from "./pages/ProtectedRoutes/ProtectedSpectator";
import { Menu } from "./pages/menu/index";
import { Game } from "./pages/game/index";
import { Spectator } from "./pages/spectator";
import { usePlayer } from "./context/PlayerContext";
import { usePlayerIsValid } from "./hooks/IdentityHooks/usePlayerIsValid";
import { useGame } from "./context/GameContext";
import { useMyUsername } from "./hooks/IdentityHooks/useMyUsername";

export const App = () => {
  const { userWallet } = usePlayer();
  const { gameID } = useGame();
  const isUserValid = usePlayerIsValid(gameID, userWallet);
  const username = useMyUsername(userWallet)

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedGame isUserValid={isUserValid} />}>
          <Route element={<Game />} path="/game/:gameID" />
        </Route>
        <Route element={<ProtectedSpectator username={username} />}>
          <Route element={<Spectator />} path="/spectator/:gameID" />
        </Route>
        <Route element={<Menu />} path="/" />
      </Routes>
    </BrowserRouter >
  );
};
