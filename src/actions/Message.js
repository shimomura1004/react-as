import axios from 'axios';

const API_SERVER = 'https://asakusa-satellite.herokuapp.com';
const LIST_ENDPOINT = '/api/v1/message/list.json';

// action creators
export const GET_MESSAGES_REQUEST = 'GET_MESSAGES_REQUEST';
const getMessagesRequest = () => {
    return {
        type: GET_MESSAGES_REQUEST
    }
};

export const GET_MESSAGES_SUCCESS = 'GET_MESSAGES_SUCCESS';
const getMessagesSuccess = (messages) => {  
    return {
        type: GET_MESSAGES_SUCCESS,
        messages,
    }
};

export const GET_MESSAGES_FAILURE = 'GET_MESSAGES_FAILURE';
const getMessagesFailure = (error) => {
    return {
        type: GET_MESSAGES_FAILURE,
        error
    }
};

export const getMessages = (api_key, room_id, options) => {
    return async (dispatch) => {
        dispatch(getMessagesRequest());

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

            dispatch(getMessagesSuccess(messages.data));
        }
        catch(err) {
            dispatch(getMessagesFailure(err));
        }
    }
};
