import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import './styles/index.css';
import App from './containers/App';
import reducer from './reducer'
import { getMessages } from './actions/Message';
import { getRooms } from './actions/Room';
import * as serviceWorker from './serviceWorker';

// setup environment
// in express environment, environment variables are stored in cookie
let cookie = {};
document.cookie.split("; ")
  .map(c => c.split("="))
  .forEach(kv => cookie[kv[0]] = decodeURIComponent(kv[1]));

document.as = {};
document.as['API_SERVER'] = process.env['REACT_APP_API_SERVER'] || cookie["api_server"];
document.as['PUSHER_SERVER'] = process.env['REACT_APP_PUSHER_SERVER'] || cookie["pusher_server"];
document.as['PUSHER_APP_KEY'] = process.env['REACT_APP_PUSHER_APP_KEY'] || cookie["pusher_app_key"];

const store = createStore(reducer, applyMiddleware(thunk));
let api_key = store.getState().get('api_key');
let room_id = store.getState().get('room_id');
store.dispatch(getRooms(api_key));
store.dispatch(getMessages(api_key, room_id));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
