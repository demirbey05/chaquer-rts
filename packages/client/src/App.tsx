import Menu from "./pages/menu/index";
import Game from "./pages/game/index";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

export const App = () => {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/game">
            <Game />
          </Route>
          <Route path="/">
            <Menu />
          </Route>
        </Switch>
      </Router>
    </>
  );
};
