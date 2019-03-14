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
import * as serviceWorker from './serviceWorker';

// setup environment
// in express environment, environment variables are stored in cookie
let cookie = {};
document.cookie.split("; ")
  .map(c => c.split("="))
  .forEach(kv => cookie[kv[0]] = decodeURIComponent(kv[1]));

window.as = {};
window.as['API_SERVER'] = process.env['REACT_APP_API_SERVER'] || cookie["api_server"];
window.as['ORIGINAL_API_SERVER'] = process.env['REACT_APP_API_SERVER'] || cookie["original_api_server"];
window.as['PUSHER_SERVER'] = process.env['REACT_APP_PUSHER_SERVER'] || cookie["pusher_server"];
window.as['PUSHER_APP_KEY'] = process.env['REACT_APP_PUSHER_APP_KEY'] || cookie["pusher_app_key"];

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

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
