import { SET_API_KEY } from '../actions/App';

const initialState = {
	api_key: '',
	room_id: '(room id here)',
};
  
export default (state = initialState, action) => {
	switch(action.type) {
	// case 'CHANGE_ROOM':
	// 	return state.set('room_id', action.room_id);

	// make it persistent
	case SET_API_KEY: {
		return {...state, api_key: action.api_key};
	}

	default:
		return state;
	}
};
