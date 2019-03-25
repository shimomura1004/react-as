import axios from 'axios';

const ROOM_ENDPOINT = '/api/v1/room/list.json';
// todo: move to messagejs
const MESSAGE_ENDPOINT = '/api/v1/message';

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

export const APPEND_MESSAGE_IN_VIEW = 'APPEND_MESSAGE_IN_VIEW';
export const appendMessageInView = (message) => {
    return (dispatch) => {
        dispatch({
            type: APPEND_MESSAGE_IN_VIEW,
            message,
            timestamp: Date.now()
        })
    }
};

export const UPDATE_MESSAGE_REQUEST = 'UPDATE_MESSAGE_REQUEST';
export const UPDATE_MESSAGE_SUCCESS = 'UPDATE_MESSAGE_SUCCESS';
export const UPDATE_MESSAGE_FAILURE = 'UPDATE_MESSAGE_FAILURE';
export const updateMessage = (api_key, message) => {
    return async (dispatch) => {
        dispatch({type: UPDATE_MESSAGE_REQUEST});

        try {
            await axios.put(`${window.as['API_SERVER']}${MESSAGE_ENDPOINT}/${message.id}.json`, {
                params: { message, api_key }
            });
            dispatch({type: UPDATE_MESSAGE_SUCCESS});
        }
        catch(err) {
            dispatch({
                type: UPDATE_MESSAGE_FAILURE,
                err,
            });
        }
    }
};

export const DELETE_MESSAGE_REQUEST = 'DELETE_MESSAGE_REQUEST';
export const DELETE_MESSAGE_SUCCESS = 'DELETE_MESSAGE_SUCCESS';
export const DELETE_MESSAGE_FAILURE = 'DELETE_MESSAGE_FAILURE';
export const deleteMessage = (api_key, message_id) => {
    return async (dispatch) => {
        dispatch({type: DELETE_MESSAGE_REQUEST});

        try {
            await axios.delete(`${window.as['API_SERVER']}${MESSAGE_ENDPOINT}/${message_id}.json`, {
                params: { api_key }
            });
            dispatch({type: DELETE_MESSAGE_SUCCESS});
        }
        catch(err) {
            dispatch({
                type: DELETE_MESSAGE_FAILURE, 
                err,
            });
        }
    }
};

export const UPDATE_MESSAGE_IN_VIEW = 'UPDATE_MESSAGE_IN_VIEW';
export const updateMessageInView = (message) => {
    return (dispatch) => {
        dispatch({
            type: UPDATE_MESSAGE_IN_VIEW,
            message,
            timestamp: Date.now()
        })
    }
};

export const DELETE_MESSAGE_IN_VIEW = 'DELETE_MESSAGE_IN_VIEW';
export const deleteMessageInView = (message_id, room_id) => {
    return (dispatch) => {
        dispatch({
            type: DELETE_MESSAGE_IN_VIEW,
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
