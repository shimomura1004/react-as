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
            let rooms = await axios.get(`${document.as['API_SERVER']}${ROOM_ENDPOINT}`, {
                params: { api_key }
            });
            dispatch(getRoomsSuccess((rooms.data)));
        }
        catch(err) {
            dispatch(getRoomsFailure(err));
        }
    }
};

export const UPDATE_TEXTFIELD = 'UPDATE_TEXTFIELD';
export const updateTextField = (text) => {
    return  (dispatch) => {
        dispatch({
            type: UPDATE_TEXTFIELD,
            text
        })
    }
};
