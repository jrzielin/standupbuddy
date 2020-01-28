import React from 'react';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import UnAuthRoute from './components/Routes/UnAuthRoute';
import HomeRoute from './components/Routes/HomeRoute';
import PrivateRoute from './components/Routes/PrivateRoute';
import NotFound from './screens/NotFound';
import Home from './screens/Home';
import StandupList from './screens/StandupList';
import Login from './screens/Login';
import Signup from './screens/Signup';

function App() {
  return (
    <Router>
      <Switch>
        <UnAuthRoute path="/login" component={Login} />
        <UnAuthRoute path="/signup" component={Signup} />
        <PrivateRoute path="/teams/:id/items" component={StandupList} />
        <HomeRoute exact path="/" component={Home} />
        <Route path="*" component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
