import {connect} from 'react-redux';
import Room from '../components/Room.js';
import { getMessages, postMessage } from '../actions/Message';
import { updateTextField, appendMessage, updateMessage, deleteMessage } from '../actions/Room';
import { find_room } from '../helpers/Room';

// todo: should we have to pass the api_key to the view?
const mapStateToProps = state => ({
    api_key: state.get('api_key'),

    loading: state.get('message_loading') || state.get('room_loading'),
    room: find_room(state.get('rooms'), state.get('room_id')),
    messages: state.get('combined_messages').toJS(),
    textfield: state.get('textfield'),
});

const mapDispatchToProps = (dispatch) => ({
    loadMessages: (loading, api_key, room_id, message_id) => {
        if (!loading) {
            getMessages(api_key, room_id, {until_id: message_id, count: 20})(dispatch);
        }
    },
    updateTextField: (text) => {
        updateTextField(text)(dispatch);
    },
    postMessage: (api_key, room_id, message) => {
        if (message !== "") {
            postMessage(api_key, room_id, message)(dispatch);
        }
    },
    appendMessage: (message) => {
        appendMessage(message)(dispatch);
    },
    updateMessage: (message) => {
        updateMessage(message)(dispatch);
    },
    deleteMessage: (id) => {
        deleteMessage(id)(dispatch);
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);
