import React from 'react';
import Auth from '../helpers/Auth';
import { Route, Redirect } from 'react-router-dom';

const HomeRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    Auth.isAuthenticated === true
      ? <Component {...props} />
      : <Redirect to="/login" {...props} />
  )} />
)

export default HomeRoute;