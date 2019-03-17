import { GET_MESSAGES_REQUEST, GET_MESSAGES_SUCCESS, GET_MESSAGES_FAILURE, POST_MESSAGE_REQUEST, POST_MESSAGE_SUCCESS, POST_MESSAGE_FAILURE } from '../actions/Message';
import { GET_ROOMS_REQUEST, GET_ROOMS_SUCCESS, GET_ROOMS_FAILURE, APPEND_MESSAGE, UPDATE_MESSAGE, DELETE_MESSAGE } from '../actions/Room';
import { TEXT_FIELD_UPDATE } from '../actions/RoomTextField';
import { merge, combine, update, remove } from '../helpers/Message';

let createInitialRoomState = () => ({
	loading: false,
	posting: false,
	merged_messages: [],
	combined_messages: [],
	text_field: "",
});	

const initialState = {
	loading: false,
	rooms: {},
};

export default (state = initialState, action) => {
	switch(action.type) {
	case GET_ROOMS_REQUEST: {
		return {
			...state,
			loading: true
		};
	}
	case GET_ROOMS_SUCCESS: {
		let rooms = {};
		action.rooms.forEach(room => {
			rooms[room.id] = {
				...createInitialRoomState(),
				...room,
			};
		});
		return {
			...state,
			loading: false,
			rooms
		};
	}
	case GET_ROOMS_FAILURE: {
		console.log(action.error);
		return {
			...state,
			loading: false
		};
	}

	case GET_MESSAGES_REQUEST: {
		return {
			...state,
			rooms: {
				...state.rooms,
				[action.room_id]: {
					...createInitialRoomState(),
					...state.rooms[action.room_id],
					loading: true
				}
			}
		}
	}
	case GET_MESSAGES_SUCCESS: {
		let room = state.rooms[action.room_id];

		let messages = action.messages.map(m => ({...m, timestamp: action.timestamp}));
		const merged_messages = merge(room.merged_messages, messages);
		const combined_messages = combine(merged_messages);

		return {
			...state,
			rooms: {
				...state.rooms,
				[action.room_id]: {
					...state.rooms[action.room_id],
					loading: false,
					merged_messages,
					combined_messages,
				}
			}
		}
	}
	case GET_MESSAGES_FAILURE: {
		console.log(action.error);
		return {
			...state,
			rooms: {
				...state.rooms,
				[action.room_id]: {
					...state.rooms[action.room_id],
					loading: false,
				}
			}
		};
	}

	case TEXT_FIELD_UPDATE: {
		return {
			...state,
			rooms: {
				...state.rooms,
				[action.room_id]: {
					...state.rooms[action.room_id],
					text_field: action.text_field,
				}
			}
		};
	}

	case POST_MESSAGE_REQUEST: {
		return {
			...state,
			rooms: {
				...state.rooms,
				[action.room_id]: {
					...state.rooms[action.room_id],
					posting: true,
				}
			}
		};
	}
	case POST_MESSAGE_SUCCESS: {
		return {
			...state,
			rooms: {
				...state.rooms,
				[action.room_id]: {
					...state.rooms[action.room_id],
					posting: false,
					text_field: "",
				}
			}
		};
	}
	case POST_MESSAGE_FAILURE: {
		return {
			...state,
			rooms: {
				...state.rooms,
				[action.room_id]: {
					...state.rooms[action.room_id],
					posting: false,
				}
			}
		};
	}

	case APPEND_MESSAGE: {
		let room = state.rooms[action.message.room.id];

		action.message.timestamp = action.timestamp;
		const merged_messages = merge(room.merged_messages, [action.message]);
		const combined_messages = combine(merged_messages);

		return {
			...state,
			rooms: {
				...state.rooms,
				[action.message.room.id]: {
					...state.rooms[action.message.room.id],
					merged_messages,
					combined_messages,
				}
			}
		}
	}
	case UPDATE_MESSAGE: {
		let room = state.rooms[action.message.room.id];

		action.message.timestamp = action.timestamp;
		const merged_messages = update(action.message, room.merged_messages);
		const combined_messages = combine(merged_messages);

		return {
			...state,
			rooms: {
				...state.rooms,
				[action.message.room.id]: {
					...state.rooms[action.message.room.id],
					merged_messages,
					combined_messages,
				}
			}
		}
	}
	case DELETE_MESSAGE: {
		let room = state.rooms[action.room_id];
		const merged_messages = remove(action.message_id, room.merged_messages);
		const combined_messages = combine(merged_messages);

		return {
			...state,
			rooms: {
				...state.rooms,
				[action.room_id]: {
					...state.rooms[action.room_id],
					merged_messages,
					combined_messages,
				}
			}
		}
	}

	default:
		return state;
	}
};