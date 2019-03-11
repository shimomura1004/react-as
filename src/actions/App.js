export const SET_API_KEY = 'SET_API_KEY';
export const setApiKey = (api_key) => {
    return (dispatch) => {
        dispatch({
            type: SET_API_KEY,
            api_key
        })
    }
}

export const SET_ROOM_ID = 'SET_ROOM_ID';
export const setRoomId = (room_id) => {
    return (dispatch) => {
        dispatch({
            type: SET_ROOM_ID,
            room_id
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
