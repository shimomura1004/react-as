import axios from 'axios';
import { API_SERVER } from '../config';

const USER_ENDPOINT = '/api/v1/user.json';

export const SET_ROOM_ID = 'SET_ROOM_ID';
export const setRoomId = (room_id) => {
    return (dispatch) => {
        dispatch({
            type: SET_ROOM_ID,
            room_id
        })
    }
}

export const GET_USER_INFO_REQUEST = 'GET_USER_INFO_REQUEST';
const getUserInfoRequest = () => {
    return {
        type: GET_USER_INFO_REQUEST
    }
};

export const GET_USER_INFO_SUCCESS = 'GET_USER_INFO_SUCCESS';
const getUserInfoSuccess = (api_key, user_info) => {
    return {
        type: GET_USER_INFO_SUCCESS,
        api_key,
        user_info,
    }
};

export const GET_USER_INFO_FAILURE = 'GET_USER_INFO_FAILURE';
const getUserInfoFailure = (error) => {
    return {
        type: GET_USER_INFO_FAILURE,
        error
    }};

export const getUserInfo = (api_key) => {
    return async (dispatch) => {
        dispatch(getUserInfoRequest());

        try {
            let user_info = await axios.get(`${API_SERVER}${USER_ENDPOINT}`, {
                params: { api_key }
            });
            dispatch(getUserInfoSuccess(api_key, user_info.data));
        }
        catch(err) {
            dispatch(getUserInfoFailure(err));
        }
    }
};

export const UPDATE_MENU_HEIGHT = 'UPDATE_MENU_HEIGHT';
export const updateMenuHeight = (menu_height) => {
    return (dispatch) => {
        dispatch({
            type: UPDATE_MENU_HEIGHT,
            menu_height,
        })
    }
}

export const LOGOUT = 'LOGOUT';
export const logout = () => {
    return (dispatch) => {
        dispatch({
            type: LOGOUT
        })
    }
}
