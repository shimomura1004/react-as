import {connect} from 'react-redux';
import Room from '../components/Room.js';
import { getRooms } from '../actions/Room';
import { getMessages, postMessage } from '../actions/Message';
import { appendMessage, updateMessage, deleteMessage } from '../actions/Room';
import { find_room } from '../helpers/Room';

const mapStateToProps = state => ({
    api_key: state.app.api_key,
    room_id: state.app.room_id,

    loading: state.room.message_loading || state.room.room_loading,
    // todo: remove room
    room: find_room(state.room.rooms, state.app.room_id),
    messages: state.room.combined_messages,
});

const mapDispatchToProps = (dispatch) => ({
    getRooms: (api_key) => {
        getRooms(api_key)(dispatch);
    },
    getMessages: (api_key, room_id) => {
        getMessages(api_key, room_id)(dispatch);
    },
    loadMessages: (loading, api_key, room_id, message_id) => {
        if (!loading) {
            getMessages(api_key, room_id, {until_id: message_id, count: 20})(dispatch);
        }
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
