export const SET_API_KEY = 'SET_API_KEY';
export const setApiKey = (api_key) => {
    return (dispatch) => {
        dispatch({
            type: SET_API_KEY,
            api_key
        })
    }
}
