import { GET_MESSAGES_REQUEST, GET_MESSAGES_SUCCESS, GET_MESSAGES_FAILURE, POST_MESSAGE_REQUEST, POST_MESSAGE_SUCCESS, POST_MESSAGE_FAILURE } from '../actions/Message';
import {
	GET_ROOMS_REQUEST, GET_ROOMS_SUCCESS, GET_ROOMS_FAILURE,
	SET_SCROLL_POSITION, APPEND_MESSAGE_IN_VIEW, UPDATE_MESSAGE_IN_VIEW, DELETE_MESSAGE_IN_VIEW,
	UPDATE_MESSAGE_FAILURE,
	DELETE_MESSAGE_FAILURE,
	WEBSOCKET_CONNECTED, WEBSOCKET_DISCONNECTED,
	HIDE_NOTIFICATION,
} from '../actions/Room';
import { TEXT_FIELD_UPDATE, TEXT_FIELD_HEIGHT_UPDATE } from '../actions/TextField';
import { merge, combine, update, remove } from '../helpers/Message';

let createInitialRoomState = () => ({
	loading: false,
	posting: false,
	merged_messages: [],
	combined_messages: [],
	text_field: "",
	text_field_height: 0,
	scroll_position: 0,
});	

const initialState = {
	loading: false,
	websocket_connected: false,
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
			if (state.rooms[room.id]) {
				rooms[room.id] = {
					...room,
					...state.rooms[room.id],
				};
			}
			else {
				rooms[room.id] = {
					...createInitialRoomState(),
					...room,
				};
			}
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
			loading: false,
			notification_open: true,
			notification_content: "Failed to get room list",
		};
	}

	case SET_SCROLL_POSITION: {
		return {
			...state,
			rooms: {
				...state.rooms,
				[action.room_id]: {
					...state.rooms[action.room_id],
					scroll_position: action.scroll_position,
				}
			}
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
		let last_message = messages[messages.length - 1];
		if (room.merged_messages.map(m => m.id).indexOf(last_message.id) >= 0) {
			// duplicated
		}

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
			},
			notification_open: true,
			notification_content: "Failed to get messages",
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

	case TEXT_FIELD_HEIGHT_UPDATE: {
		return {
			...state,
			rooms: {
				...state.rooms,
				[action.room_id]: {
					...state.rooms[action.room_id],
					text_field_height: action.height,
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
			},
			notification_open: true,
			notification_content: "Failed to post messages",
		};
	}

	case UPDATE_MESSAGE_FAILURE: {
		console.log(action.error);
		return {
			...state,
			notification_open: true,
			notification_content: "Failed to update messages",
		};
	}
	case DELETE_MESSAGE_FAILURE: {
		console.log(action.error);
		return {
			...state,
			notification_open: true,
			notification_content: "Failed to delete messages",
		};
	}

	case APPEND_MESSAGE_IN_VIEW: {
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
	case UPDATE_MESSAGE_IN_VIEW: {
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
	case DELETE_MESSAGE_IN_VIEW: {
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

	case WEBSOCKET_CONNECTED: {
		return {
			...state,
			websocket_connected: true,
		};
	}

	case WEBSOCKET_DISCONNECTED: {
		return {
			...state,
			websocket_connected: false,
		};
	}

	case HIDE_NOTIFICATION: {
		return {
			...state,
			notification_open: false,
			notification_content: "",
		}
	}

	default:
		return state;
	}
};