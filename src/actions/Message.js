import axios from 'axios';

const LIST_ENDPOINT = '/api/v1/message/list.json';
const POST_ENDPOINT = '/api/v1/message.json';

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
            let messages = await axios.get(`${document.as['API_SERVER']}${LIST_ENDPOINT}`, {
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


export const POST_MESSAGE_REQUEST = 'POST_MESSAGE_REQUEST';
const postMessageRequest = (message) => {
    return {
        type: POST_MESSAGE_REQUEST,
        message,
    }
};

export const POST_MESSAGE_SUCCESS = 'POST_MESSAGE_SUCCESS';
const postMessageSuccess = () => {  
    return {
        type: POST_MESSAGE_SUCCESS
    }
};

export const POST_MESSAGE_FAILURE = 'POST_MESSAGE_FAILURE';
const postMessageFailure = (error) => {
    return {
        type: POST_MESSAGE_FAILURE,
        error
    }
};

export const postMessage = (api_key, room_id, message) => {
    return async (dispatch) => {
        dispatch(postMessageRequest());

        try {
            await axios.post(`${document.as['API_SERVER']}${POST_ENDPOINT}`, {
                api_key, room_id, message
            });
            dispatch(postMessageSuccess());
        }
        catch (error) {
            dispatch(postMessageFailure(error));
        }
    }
}