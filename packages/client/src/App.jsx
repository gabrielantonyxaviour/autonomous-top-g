import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Error404 from "./Error404";
import GamePage from "./Gamepage";
import Home from "./Home";

function App() {
  return (
    <Router>
      <Navbar className="select-custom" />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/game" component={GamePage} />
        <Route path="*" component={Error404} />
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
