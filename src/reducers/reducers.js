import { combineReducers } from 'redux';

import app from "./App";
import room from "./Room";

export default combineReducers({
    app,
    room
});