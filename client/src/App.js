import React from 'react';
import {BrowserRouter as Router, Switch} from "react-router-dom";
import StandupList from './components/StandupList';
import Login from './components/Login';
import Signup from './components/Signup';
import UnAuthRoute from './components/UnAuthRoute';
import HomeRoute from './components/HomeRoute';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Switch>
        <UnAuthRoute path="/login" component={Login} />
        <UnAuthRoute path="/signup" component={Signup} />
        <PrivateRoute path="/items" component={StandupList} />
        <HomeRoute path="/" component={StandupList} />
      </Switch>
    </Router>
  );
}

export default App;
