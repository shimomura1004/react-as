import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import './styles/index.css';
import App from './containers/App';
import rootReducer from './reducers/reducers'
import { SET_ENVIRONMENT_VARIABLE } from './actions/App';

// persistent settings
const persistConfig = {
  key: 'primary',
  storage,
  whitelist: ['app']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer);
const persistor = persistStore(store);
// persistor.purge()

// setup environment
// in express environment, environment variables are stored in cookie
let cookie = {};
document.cookie.split("; ")
  .map(c => c.split("="))
  .forEach(kv => cookie[kv[0]] = decodeURIComponent(kv[1]));

window.as = {};
window.as['API_SERVER'] = localStorage.getItem("api_server") || process.env['REACT_APP_API_SERVER'] || cookie["api_server"];
window.as['ORIGINAL_API_SERVER'] = localStorage.getItem("original_api_server") || process.env['REACT_APP_API_SERVER'] || cookie["original_api_server"];
window.as['PUSHER_SERVER'] = localStorage.getItem("pusher_server") || process.env['REACT_APP_PUSHER_SERVER'] || cookie["pusher_server"];
window.as['PUSHER_APP_KEY'] = localStorage.getItem("pusher_api_key") || process.env['REACT_APP_PUSHER_APP_KEY'] || cookie["pusher_app_key"];

// store/restore variables to/from localStorage
localStorage.setItem("api_server", window.as['API_SERVER']);
localStorage.setItem("original_api_server", window.as['ORIGINAL_API_SERVER']);
localStorage.setItem("pusher_server", window.as['PUSHER_SERVER']);
localStorage.setItem("pusher_api_key", window.as['PUSHER_APP_KEY']);

// render app
ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

// register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js');
    });
}
