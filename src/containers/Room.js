import {connect} from 'react-redux';
import Room from '../components/Room.js';
import { getRooms, appendMessage, updateMessage, deleteMessage } from '../actions/Room';
import { getMessages, postMessage } from '../actions/Message';
import { logout, setRoomId } from '../actions/App';

const mapStateToProps = state => {
    if (state.room.rooms === undefined || Object.keys(state.room.rooms).length === 0) {
        return {
            api_key: state.app.api_key,
            room_id: state.app.room_id,
            room: {},
            rooms: [],
            messages: [],
        };
    }

    let message_loading = state.app.room_id === '' ? false : state.room.message_loading[state.app.room_id];
    let combined_messages = state.app.room_id === '' ? [] : state.room.rooms[state.app.room_id].combined_messages;
    return {
        api_key: state.app.api_key,
        room_id: state.app.room_id,

        loading: message_loading,
        rooms: Object.values(state.room.rooms),
        room: state.room.rooms[state.app.room_id],
        messages: combined_messages,
    };
};

const mapDispatchToProps = (dispatch) => ({
    getRooms: (api_key) => {
        getRooms(api_key)(dispatch);
    },
    appendMessage: (message) => {
        appendMessage(message)(dispatch);
    },
    updateMessage: (message) => {
        updateMessage(message)(dispatch);
    },
    deleteMessage: (message_id, room_id) => {
        deleteMessage(message_id, room_id)(dispatch);
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
    setRoomId: (id) => {
        setRoomId(id)(dispatch);
    },
    logout: () => {
        logout()(dispatch);
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);
