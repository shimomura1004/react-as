import { SET_ROOM_ID, GET_USER_INFO_REQUEST, GET_USER_INFO_SUCCESS, GET_USER_INFO_FAILURE, UPDATE_MENU_HEIGHT, LOGOUT } from '../actions/App';

const initialState = {
	api_key: '',
	room_id: '',
	screen_name: '',
	menu_height: 0,
};

// todo: check api key is valid or not by getting user information
export default (state = initialState, action) => {
	switch(action.type) {

	case SET_ROOM_ID: {
		return {
			...state,
			room_id: action.room_id
		};
	}

	case GET_USER_INFO_REQUEST: {
		return state;
	}

	case GET_USER_INFO_SUCCESS: {
		return {
			...state,
			api_key: action.api_key,
			screen_name: action.user_info.screen_name,
		};
	}

	case GET_USER_INFO_FAILURE: {
		console.log(action.error);
		return state;
	}

	case UPDATE_MENU_HEIGHT: {
		return {
			...state,
			menu_height: action.menu_height,
		};
	}

	case LOGOUT: {
		// todo: remove state.room.*
		return {...initialState};
	}

	default:
		return state;
	}
};
