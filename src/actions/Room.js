import axios from 'axios';

const ROOM_ENDPOINT = '/api/v1/room/list.json';

// action creators
export const GET_ROOMS_REQUEST = 'GET_ROOMS_REQUEST';
const getRoomsRequest = () => {
    return {
        type: GET_ROOMS_REQUEST
    }
};

export const GET_ROOMS_SUCCESS = 'GET_ROOMS_SUCCESS';
const getRoomsSuccess = (rooms) => {
    return {
        type: GET_ROOMS_SUCCESS,
        rooms,
    }
};

export const GET_ROOMS_FAILURE = 'GET_ROOMS_FAILURE';
const getRoomsFailure = (error) => {
    return {
        type: GET_ROOMS_FAILURE,
        error
    }
};

export const getRooms = (api_key) => {
    return async (dispatch) => {
        dispatch(getRoomsRequest());

        try {
            let rooms = await axios.get(`${window.as['API_SERVER']}${ROOM_ENDPOINT}`, {
                params: { api_key }
            });
            dispatch(getRoomsSuccess(rooms.data));
        }
        catch(err) {
            dispatch(getRoomsFailure(err));
        }
    }
};

export const SET_SCROLL_POSITION = 'SET_SCROLL_POSITION';
export const setScrollPosition = (room_id, scroll_position) => {
    return (dispatch) => {
        dispatch({
            type: SET_SCROLL_POSITION,
            room_id,
            scroll_position,
        })
    }
}

export const APPEND_MESSAGE = 'APPEND_MESSAGE';
export const appendMessage = (message) => {
    return (dispatch) => {
        dispatch({
            type: APPEND_MESSAGE,
            message,
            timestamp: Date.now()
        })
    }
};

export const UPDATE_MESSAGE = 'UPDATE_MESSAGE';
export const updateMessage = (message) => {
    return (dispatch) => {
        dispatch({
            type: UPDATE_MESSAGE,
            message,
            timestamp: Date.now()
        })
    }
};

export const DELETE_MESSAGE = 'DELETE_MESSAGE';
export const deleteMessage = (message_id, room_id) => {
    return (dispatch) => {
        dispatch({
            type: DELETE_MESSAGE,
            message_id,
            room_id,
        })
    }
};

export const WEBSOCKET_CONNECTED = 'WEBSOCKET_CONNECTED';
export const websocketConnected = () => {
    return (dispatch) => {
        dispatch({
            type: WEBSOCKET_CONNECTED,
        })
    }
}

export const WEBSOCKET_DISCONNECTED = 'WEBSOCKET_DISCONNECTED';
export const websocketDisconnected = () => {
    return (dispatch) => {
        dispatch({
            type: WEBSOCKET_DISCONNECTED,
        })
    }
}
