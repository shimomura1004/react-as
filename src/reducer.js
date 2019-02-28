import { List, Map, fromJS } from 'immutable';
import { GET_MESSAGES_REQUEST, GET_MESSAGES_SUCCESS, GET_MESSAGES_FAILURE, POST_MESSAGE_SUCCESS } from './actions/Message';
import { GET_ROOMS_REQUEST, GET_ROOMS_SUCCESS, GET_ROOMS_FAILURE, UPDATE_TEXTFIELD, APPEND_MESSAGE, UPDATE_MESSAGE, DELETE_MESSAGE } from './actions/Room';
import { merge, combine, update, remove } from './helpers/Message';

const initialState = Map({
	api_key: '(your api key here)',

	message_loading: false,
	room_loading: false,
	room_id: 'as',
	textfield: "",
	messages: List([]),
	combined_messages: List([]),
	rooms: List([]),
});
  
export default (state = initialState, action) => {
	switch(action.type) {
	// case 'CHANGE_ROOM':
	// 	return state.set('room_id', action.room_id);

	case GET_MESSAGES_REQUEST: {
		return state.set('message_loading', true);
	}
	case GET_MESSAGES_SUCCESS: {
		let messages = fromJS(action.messages);
		messages = messages.map(m => m.set("timestamp", action.timestamp));
		const merged_messages = merge(state.get('messages'), messages);
		const combined_messages = combine(merged_messages);
		return state
			.set('message_loading', false)
			.set('messages', merged_messages)
			.set('combined_messages', combined_messages);
	}
	case GET_MESSAGES_FAILURE: {
		console.log(action.error);
		return state.set('message_loading', false);
	}

	case GET_ROOMS_REQUEST: {
		return state.set('room_loading', true);
	}
	case GET_ROOMS_SUCCESS: {
		return state
			.set('room_loading', false)
			.set('rooms', action.rooms);
	}
	case GET_ROOMS_FAILURE: {
		console.log(action.error);
		return state.set('room_loading', false);
	}

	case UPDATE_TEXTFIELD: {
		return state.set('textfield', action.text);
	}

	case POST_MESSAGE_SUCCESS: {
		return state.set('textfield', '');
	}

	case APPEND_MESSAGE: {
		action.message.timestamp = action.timestamp;
		const merged_messages = merge(state.get('messages'), fromJS([action.message]));
		const combined_messages = combine(merged_messages);
		return state
			.set('messages', merged_messages)
			.set('combined_messages', combined_messages);
	}
	case UPDATE_MESSAGE: {
		action.message.timestamp = action.timestamp;
		const messages = update(fromJS(action.message), state.get('messages'));
		const combined_messages = combine(messages);
		return state
			.set('messages', messages)
			.set('combined_messages', combined_messages);
	}
	case DELETE_MESSAGE: {
		const messages = remove(action.id, state.get('messages'));
		const combined_messages = combine(messages);
		return state
			.set('messages', messages)
			.set('combined_messages', combined_messages);
	}

	default:
		return state;
	}
};
