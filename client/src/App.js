import React from 'react';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import StandupList from './components/StandupList';
import Login from './components/Login';
import Signup from './components/Signup';
import UnAuthRoute from './components/UnAuthRoute';
import HomeRoute from './components/HomeRoute';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './screens/NotFound';

function App() {
  return (
    <Router>
      <Switch>
        <UnAuthRoute path="/login" component={Login} />
        <UnAuthRoute path="/signup" component={Signup} />
        <PrivateRoute path="/items" component={StandupList} />
        <HomeRoute exact path="/" component={StandupList} />
        <Route path="*" component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
