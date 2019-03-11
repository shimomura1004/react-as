import { GET_MESSAGES_REQUEST, GET_MESSAGES_SUCCESS, GET_MESSAGES_FAILURE, POST_MESSAGE_SUCCESS } from '../actions/Message';
import { GET_ROOMS_REQUEST, GET_ROOMS_SUCCESS, GET_ROOMS_FAILURE, APPEND_MESSAGE, UPDATE_MESSAGE, DELETE_MESSAGE } from '../actions/Room';
import { merge, combine, update, remove } from '../helpers/Message';

const initialState = {
	message_loading: false,
	room_loading: false,
	messages: [],
	combined_messages: [],
	rooms: [],
};
  
export default (state = initialState, action) => {
	switch(action.type) {
	case GET_MESSAGES_REQUEST: {
		return {...state, message_loading: true};
	}
	case GET_MESSAGES_SUCCESS: {
		let messages = action.messages.map(m => ({...m, timestamp: action.timestamp}));
		const merged_messages = merge(state.messages, messages);
		const combined_messages = combine(merged_messages);
		return {
			...state,
			message_loading: false,
			messages: merged_messages,
			combined_messages: combined_messages,
		};
	}
	case GET_MESSAGES_FAILURE: {
		console.log(action.error);
		return {...state, message_loading: false};
	}

	case GET_ROOMS_REQUEST: {
		return {...state, room_loading: true};
	}
	case GET_ROOMS_SUCCESS: {
		return {...state, room_loading: false, rooms: action.rooms};
	}
	case GET_ROOMS_FAILURE: {
		console.log(action.error);
		return {...state, room_loading: false};
	}

	case POST_MESSAGE_SUCCESS: {
		document.getElementById("text_field").value = "";
		return state;
	}

	case APPEND_MESSAGE: {
		action.message.timestamp = action.timestamp;
		const merged_messages = merge(state.messages, [action.message]);
		const combined_messages = combine(merged_messages);
		return {
			...state,
			messages: merged_messages,
			combined_messages: combined_messages,
		};
	}
	case UPDATE_MESSAGE: {
		action.message.timestamp = action.timestamp;
		const messages = update(action.message, state.messages);
		const combined_messages = combine(messages);
		return {
			...state,
			messages: messages,
			combined_messages: combined_messages,
		}
	}
	case DELETE_MESSAGE: {
		const messages = remove(action.id, state.messages);
		const combined_messages = combine(messages);
		return {
			...state,
			messages: messages,
			combined_messages: combined_messages
		};
	}

	default:
		return state;
	}
};