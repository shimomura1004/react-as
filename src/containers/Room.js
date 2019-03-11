import {connect} from 'react-redux';
import Room from '../components/Room.js';
import { getMessages, postMessage } from '../actions/Message';
import { appendMessage, updateMessage, deleteMessage } from '../actions/Room';
import { find_room } from '../helpers/Room';
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

    return {
        api_key: state.app.api_key,
        room_id: state.app.room_id,

        loading: state.room.rooms[state.app.room_id].message_loading,
        rooms: Object.values(state.room.rooms),
        room: state.room.rooms[state.app.room_id],
        messages: state.room.rooms[state.app.room_id].combined_messages,
    };
};

const mapDispatchToProps = (dispatch) => ({
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
    },
    setRoomId: (id) => {
        setRoomId(id)(dispatch);
    },
    logout: () => {
        logout()(dispatch);
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);
