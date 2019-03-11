import { GET_MESSAGES_REQUEST, GET_MESSAGES_SUCCESS, GET_MESSAGES_FAILURE, POST_MESSAGE_SUCCESS } from '../actions/Message';
import { GET_ROOMS_REQUEST, GET_ROOMS_SUCCESS, GET_ROOMS_FAILURE, APPEND_MESSAGE, UPDATE_MESSAGE, DELETE_MESSAGE } from '../actions/Room';
import { merge, combine, update, remove } from '../helpers/Message';

const initialRoomState = {
	message_loading: false,
	merged_messages: [],
	combined_messages: [],
};

const initialState = {
	room_loading: false,
	rooms: {},
};

export default (state = initialState, action) => {
	switch(action.type) {
	case GET_ROOMS_REQUEST: {
		return {...state, room_loading: true};
	}
	case GET_ROOMS_SUCCESS: {
		let rooms = {};
		action.rooms.forEach(room => {
			rooms[room.id] = {...room, ...initialRoomState};
		});
		return {...state, room_loading: false, rooms: rooms};
	}
	case GET_ROOMS_FAILURE: {
		console.log(action.error);
		return {...state, room_loading: false};
	}

	case GET_MESSAGES_REQUEST: {
		if (state.rooms[action.room_id]) {
			state.rooms[action.room_id].message_loading = true;
		}
		return {...state};
	}
	case GET_MESSAGES_SUCCESS: {
		let room = state.rooms[action.room_id];

		let messages = action.messages.map(m => ({...m, timestamp: action.timestamp}));
		const merged_messages = merge(room.merged_messages, messages);
		const combined_messages = combine(merged_messages);

		room.message_loading = false;
		room.merged_messages = merged_messages;
		room.combined_messages = combined_messages;

		return {...state};
	}
	case GET_MESSAGES_FAILURE: {
		console.log(action.error);
		return {...state, message_loading: false};
	}

	case POST_MESSAGE_SUCCESS: {
		document.getElementById("text_field").value = "";
		return state;
	}

	case APPEND_MESSAGE: {
		action.message.timestamp = action.timestamp;

		let room = state.rooms[action.message.room.id];
		const merged_messages = merge(room.merged_messages, [action.message]);
		const combined_messages = combine(merged_messages);

		room.merged_messages = merged_messages;
		room.combined_messages = combined_messages;
		return {...state};
	}
	case UPDATE_MESSAGE: {
		action.message.timestamp = action.timestamp;

		let room = state.rooms[action.message.room.id];
		const merged_messages = update(action.message, room.merged_messages);
		const combined_messages = combine(merged_messages);

		room.merged_messages = merged_messages;
		room.combined_messages = combined_messages;
		return {...state};
	}
	case DELETE_MESSAGE: {
		let room = state.rooms[action.room_id];
		const merged_messages = remove(action.message_id, room.merged_messages);
		const combined_messages = combine(merged_messages);

		room.merged_messages = merged_messages;
		room.combined_messages = combined_messages;
		return {...state};
	}

	default:
		return state;
	}
};