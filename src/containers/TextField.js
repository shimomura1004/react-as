import {connect} from 'react-redux';
import TextField from '../components/TextField';
import { updateTextField } from '../actions/TextField';
import { postMessage } from '../actions/Message';

const mapStateToProps = state => {
    const room = state.room.rooms[state.app.room_id];
    return {
        api_key: state.app.api_key,
        room_id: state.app.room_id,
        websocket_connected: state.room.websocket_connected,
        room_name: room && room.name,
        posting: room && room.posting,
        text_field: room && room.text_field,
    };
};

const mapDispatchToProps = (dispatch) => ({
    updateTextField: (room_id, text_field) => {
        updateTextField(room_id, text_field)(dispatch);
    },
    postMessage: (api_key, room_id, message) => {
        if (message !== "") {
            postMessage(api_key, room_id, message)(dispatch);
        }
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(TextField);
