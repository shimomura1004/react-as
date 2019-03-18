import {connect} from 'react-redux';
import Room from '../components/Room.js';
import { setScrollPosition, appendMessage, updateMessage, deleteMessage } from '../actions/Room';
import { getMessages, postMessage } from '../actions/Message';
import { logout, setRoomId } from '../actions/App';

const mapStateToProps = state => {
    if (state.app.room_id === '' || Object.keys(state.room.rooms).length === 0) {
        return {
            api_key: state.app.api_key,
            room_id: state.app.room_id,
            loading: false,
            posting: false,
            room: {},
            rooms: [],
            messages: [],
            scroll_position: 0,
        };
    }

    let room = state.room.rooms[state.app.room_id];
    let loading = state.app.room_id === '' ? false : room.loading;
    let posting = state.app.room_id === '' ? false : room.posting;
    let messages = state.app.room_id === '' ? [] : room.combined_messages;
    let scroll_position = state.app.room_id === '' ? 0 : room.scroll_position;

    return {
        api_key: state.app.api_key,
        room_id: state.app.room_id,
        loading,
        posting,
        room,
        messages,
        scroll_position,
    };
};

const mapDispatchToProps = (dispatch) => ({
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
    setRoomId: (room_id) => {
        setRoomId(room_id)(dispatch);
    },
    setScrollPosition: (room_id, scroll_position) => {
        setScrollPosition(room_id, scroll_position)(dispatch);
    },
    logout: () => {
        logout()(dispatch);
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);
