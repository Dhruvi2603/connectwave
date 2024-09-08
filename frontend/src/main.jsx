import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import authReducer from "./state"; 
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';
import ErrorBoundary from './components/errorboundary/ErrorBoundary';

// Redux Persist Configuration
const persistConfig = {
  key: "root",
  storage,
  version: 1,
  blacklist: ['socket'], // List reducers to exclude from persistence if necessary
};

const persistedReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'auth/setSocket'],
        ignoredPaths: ['socket'],
      },
    }),
});

const persistor = persistStore(store);

// Create a root and render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ErrorBoundary>
        <App />
        </ErrorBoundary>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
