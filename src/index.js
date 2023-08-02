import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { combineReducers, configureStore} from '@reduxjs/toolkit';
import { Provider } from 'react-redux'
import {pageSlice} from './reducers/PageReducer';
import userSlice from './reducers/UserReducer';
import { BrowserRouter } from 'react-router-dom';
import thunk from "redux-thunk"
import logger from "redux-logger"
import history from './history';
const root = ReactDOM.createRoot(document.getElementById('root'));

const reducer = combineReducers({
  pages: pageSlice.reducer,
  users: userSlice.reducer
})
const store = configureStore({reducer:reducer,

  middleware: (getDefaultMiddleware) => getDefaultMiddleware(

    { serializableCheck: false
    }
  ).concat(logger)

})
root.render(
  <BrowserRouter history={history}>
  <Provider store={store} >
    <React.StrictMode>
        <App />
    </React.StrictMode>  
    </Provider>
   </BrowserRouter>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
