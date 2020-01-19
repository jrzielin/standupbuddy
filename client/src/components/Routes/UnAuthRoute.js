import React from 'react';
import Auth from '../../helpers/Auth';
import { Redirect, Route } from 'react-router-dom';

const UnAuthRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    Auth.isAuthenticated === false
      ? <Component {...props} />
      : <Redirect to='/' />
  )} />
)

export default UnAuthRoute;