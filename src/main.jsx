import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { combineReducers, configureStore} from '@reduxjs/toolkit';
import { Provider } from 'react-redux'
import {pageSlice} from './reducers/PageReducer';
import userSlice from './reducers/UserReducer';
import bookSlice from './reducers/BookReducer';
import libSlice from './reducers/LibraryReducer';
import { BrowserRouter } from 'react-router-dom';
import logger from "redux-logger"
import commentSlice from './reducers/CommentReducer';
import hashSlice from './reducers/HashtagReducer.jsx';

const reducer = combineReducers({
  hashtags:hashSlice.reducer,
  pages: pageSlice.reducer,
  users: userSlice.reducer,
  books: bookSlice.reducer,
  libraries: libSlice.reducer,
  comments: commentSlice.reducer
})
const store = configureStore({reducer:reducer,

  middleware: (getDefaultMiddleware) => getDefaultMiddleware(

    { serializableCheck: false
    }
  ).concat(logger)

})
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Provider store={store} >

    {/* <React.StrictMode> */}
    <App />
       
    {/* </React.StrictMode> */}

  </Provider>
  
   </BrowserRouter>,
);