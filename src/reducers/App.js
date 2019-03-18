import { SET_API_KEY, SET_ROOM_ID, LOGOUT } from '../actions/App';

const initialState = {
	api_key: '',
	room_id: '',
};
  
export default (state = initialState, action) => {
	switch(action.type) {
	case SET_API_KEY: {
		return {...state, api_key: action.api_key};
	}

	case SET_ROOM_ID: {
		return {...state, room_id: action.room_id};
	}

	case LOGOUT: {
		// todo: remove state.room.*
		return {...initialState};
	}

	default:
		return state;
	}
};
