import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { combineReducers, configureStore} from '@reduxjs/toolkit';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux'
import {pageSlice} from './reducers/PageReducer';
import userSlice from './reducers/UserReducer';
import bookSlice from './reducers/BookReducer.jsx';
import rolesSlice from './reducers/RoleReducer.jsx';
import logger from "redux-logger"
import commentSlice from './reducers/CommentReducer';
import hashSlice from './reducers/HashtagReducer.jsx';
import { Helmet, HelmetProvider } from 'react-helmet-async';
const reducer = combineReducers({
  hashtags:hashSlice.reducer,
  pages: pageSlice.reducer,
  users: userSlice.reducer,
  books: bookSlice.reducer,
  comments: commentSlice.reducer,
  roles: rolesSlice.reducer
})
const store = configureStore({reducer:reducer,

  middleware: (getDefaultMiddleware) => getDefaultMiddleware(

    { serializableCheck: false
    }
  )
   .concat(logger)

})
const helmetContext = {};
ReactDOM.createRoot(document.getElementById('root')).render(
  <HelmetProvider context={helmetContext}>
  
  <Provider store={store} >
  <Router>
    {/* <React.StrictMode> */}
    <App />
    </Router>
    {/* </React.StrictMode> */}

  </Provider>

  </HelmetProvider>
  
  ,
);