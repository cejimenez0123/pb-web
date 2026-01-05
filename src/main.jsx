import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { combineReducers, configureStore} from '@reduxjs/toolkit';

import { Provider } from 'react-redux'
import {pageSlice} from './reducers/PageReducer';
import userSlice from './reducers/UserReducer';
import bookSlice from './reducers/BookReducer.jsx';
import rolesSlice from './reducers/RoleReducer.jsx';
import logger from "redux-logger"
import commentSlice from './reducers/CommentReducer';
import hashSlice from './reducers/HashtagReducer.jsx';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { LoadScript } from '@react-google-maps/api';
import '@ionic/react/css/core.css';
import * as Sentry from "@sentry/react";
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

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


Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,

  sendDefaultPii: true
});
let helmetContext = {};
const app =   (
  
  <HelmetProvider context={helmetContext}>
  
  <link
  rel="stylesheet"
  href="https://unpkg.com/react-quill@1.3.3/dist/quill.snow.css"
/>
<script src="/socket.io/socket.io.js"></script>


<script src="https://cdn.socket.io/4.8.1/socket.io.min.js"></script>

<script
  src="https://unpkg.com/react@16/umd/react.development.js"
  crossOrigin
></script>
<script
  src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"
  crossOrigin
></script>
<script src="https://unpkg.com/react-quill@1.3.3/dist/react-quill.js"></script>
<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
        <script src="https://kit.fontawesome.com/08dbe310f1.js" crossOrigin="anonymous"></script>
         <script type="text/javascript" src="Scripts/jquery-2.1.1.min.js"></script>  
<Provider store={store} >




  <App />




</Provider>
</HelmetProvider>

)
ReactDOM.createRoot(document.getElementById('root')).render(
  app
  );