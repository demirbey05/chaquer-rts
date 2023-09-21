import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ProtectedRoutes } from "./pages/ProtectedRoutes";
import { Menu } from "./pages/menu/index";
import { Game } from "./pages/game/index";

export const App = () => {
  return (
    <>
      <Router>
        <Switch>
          <ProtectedRoutes component={Game} exact path="/game" />
          <Route component={Menu} path="/" />
        </Switch>
      </Router >
    </>
  );
};
