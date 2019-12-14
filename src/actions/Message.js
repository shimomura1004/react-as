import axios from 'axios';
import { API_SERVER } from '../config';
import { hideNotification } from './Room';

const LIST_ENDPOINT = '/api/v1/message/list.json';
const POST_ENDPOINT = '/api/v1/message.json';

// action creators
export const GET_MESSAGES_REQUEST = 'GET_MESSAGES_REQUEST';
const getMessagesRequest = (room_id) => {
    return {
        type: GET_MESSAGES_REQUEST,
        room_id,
    }
};

export const GET_MESSAGES_SUCCESS = 'GET_MESSAGES_SUCCESS';
const getMessagesSuccess = (messages, room_id) => {
    return {
        type: GET_MESSAGES_SUCCESS,
        messages,
        room_id,
        timestamp: Date.now()
    }
};
const getMessagesInGapSuccess = (messages, room_id, gap_marker_id) => {
    return {
        // todo: separate action type? -> GET_MESSAGES_IN_GAP_SUCCESS
        type: GET_MESSAGES_SUCCESS,
        messages,
        room_id,
        timestamp: Date.now(),
        gap_marker_id
    }
};

export const GET_MESSAGES_FAILURE = 'GET_MESSAGES_FAILURE';
const getMessagesFailure = (error, room_id) => {
    return {
        type: GET_MESSAGES_FAILURE,
        error,
        room_id,
    }
};

export const getMessages = (api_key, room_id, options) => {
    return async (dispatch) => {
        dispatch(getMessagesRequest(room_id));

        try {
            let messages = await axios.get(`${API_SERVER}${LIST_ENDPOINT}`, {
                params: { api_key, room_id, ...options }
            });

            if (options && (options.until_id !== undefined)) {
                // data is in reverse time order if until_id is specified
                messages.data.reverse();

                // remove message that is used for id
                messages.data.pop();
            }

            dispatch(getMessagesSuccess(messages.data, room_id));
        }
        catch(err) {
            dispatch(getMessagesFailure(err, room_id));
            hideNotification(dispatch);
        }
    }
};

// todo: merge with getMessages
export const getMessagesInGap = (api_key, room_id, gap_marker_id, options) => {
    return async (dispatch) => {
        dispatch(getMessagesRequest(room_id));

        try {
            let messages = await axios.get(`${API_SERVER}${LIST_ENDPOINT}`, {
                params: { api_key, room_id, ...options }
            });

            if (options && (options.until_id !== undefined)) {
                // data is in reverse time order if until_id is specified
                messages.data.reverse();

                // remove message that is used for id
                messages.data.pop();
            }

            dispatch(getMessagesInGapSuccess(messages.data, room_id, gap_marker_id));
        }
        catch(err) {
            dispatch(getMessagesFailure(err, room_id));
            hideNotification(dispatch);
        }
    }
};

export const POST_MESSAGE_REQUEST = 'POST_MESSAGE_REQUEST';
const postMessageRequest = (room_id) => {
    return {
        type: POST_MESSAGE_REQUEST,
        room_id,
    }
};

export const POST_MESSAGE_SUCCESS = 'POST_MESSAGE_SUCCESS';
const postMessageSuccess = (room_id) => {
    return {
        type: POST_MESSAGE_SUCCESS,
        room_id,
    }
};

export const POST_MESSAGE_FAILURE = 'POST_MESSAGE_FAILURE';
const postMessageFailure = (error, room_id) => {
    return {
        type: POST_MESSAGE_FAILURE,
        error,
        room_id,
    }
};

export const postMessage = (api_key, room_id, message) => {
    return async (dispatch) => {
        dispatch(postMessageRequest(room_id));

        try {
            await axios.post(`${API_SERVER}${POST_ENDPOINT}`, {
                api_key, room_id, message
            });
            dispatch(postMessageSuccess(room_id));
        }
        catch (error) {
            dispatch(postMessageFailure(error, room_id));
            hideNotification(dispatch);
        }
    }
};
