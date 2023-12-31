// import {useSelector} from 'react-redux'
// import React from 'react'

import { Route, Navigate } from 'react-router-dom';
const PrivateRoute = ({ loggedIn, children }) => {
    return loggedIn? children : <Navigate to="/login" />;
  };
export default PrivateRoute;