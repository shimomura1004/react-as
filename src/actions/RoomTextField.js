export const TEXT_FIELD_UPDATE = 'TEXT_FIELD_UPDATE';

export const updateTextField = (room_id, text_field) => {
    return (dispatch) => {
        dispatch({
            type: TEXT_FIELD_UPDATE,
            room_id,
            text_field,
        });
    }
};
