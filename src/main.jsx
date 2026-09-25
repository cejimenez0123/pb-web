import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import * as Sentry from "@sentry/react";

import "./index.css";
import "./App.css";

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import App from "./App";

import { pageSlice } from "./reducers/PageReducer";
import userSlice from "./reducers/UserReducer";
import bookSlice from "./reducers/BookReducer.jsx";
import rolesSlice from "./reducers/RoleReducer.jsx";
import commentSlice from "./reducers/CommentReducer";
import hashSlice from "./reducers/HashtagReducer.jsx";
import paginationSlice from "./reducers/PaginationSlice.jsx";
import moderationSlice from "./reducers/ModerationReducer.jsx";

const reducer = combineReducers({
  hashtags: hashSlice.reducer,
  pages: pageSlice.reducer,
  users: userSlice.reducer,
  books: bookSlice.reducer,
  comments: commentSlice.reducer,
  roles: rolesSlice.reducer,
  pagination: paginationSlice.reducer,
  moderation: moderationSlice.reducer,
});

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger),
});

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    sendDefaultPii: true,
  });
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    'Could not find the React mount element: <div id="root"></div>.'
  );
}

console.log(
  "[Bootstrap] Mounting one React application into #root"
);

ReactDOM.createRoot(rootElement).render(
  <HelmetProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </HelmetProvider>
);