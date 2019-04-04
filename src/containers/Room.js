import {connect} from 'react-redux';
import Room from '../components/Room.js';
import { setScrollPosition, updateMessage, deleteMessage, appendMessageInView, updateMessageInView, deleteMessageInView, websocketConnected, websocketDisconnected } from '../actions/Room';
import { getMessages, postMessage } from '../actions/Message';
import { logout, setRoomId } from '../actions/App';

const NUMBER_OF_MESSAGES_TO_GET = 40;

const mapStateToProps = state => {
    if (state.app.room_id === '' || Object.keys(state.room.rooms).length === 0) {
        return {
            api_key: state.app.api_key,
            screen_name: state.app.screen_name,
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
        screen_name: state.app.screen_name,
        room_id: state.app.room_id,
        loading,
        posting,
        room,
        messages,
        scroll_position,
    };
};

const mapDispatchToProps = (dispatch) => ({
    updateMessage: (api_key, message_id, message_body) => {
        updateMessage(api_key, message_id, message_body)(dispatch);
    },
    deleteMessage: (api_key, message_id) => {
        deleteMessage(api_key, message_id)(dispatch);
    },

    appendMessageInView: (message) => {
        appendMessageInView(message)(dispatch);
    },
    updateMessageInView: (message) => {
        updateMessageInView(message)(dispatch);
    },
    deleteMessageInView: (message_id, room_id) => {
        deleteMessageInView(message_id, room_id)(dispatch);
    },

    websocketConnected: () => {
        websocketConnected()(dispatch);
    },
    websocketDisconnected: () => {
        websocketDisconnected()(dispatch);
    },

    // todo: skip if already getting messages
    getMessages: (loading, api_key, room_id) => {
        if (!loading) {
            getMessages(api_key, room_id, {count: NUMBER_OF_MESSAGES_TO_GET})(dispatch);
        }
    },
    loadMessages: (loading, api_key, room_id, message_id) => {
        if (!loading) {
            getMessages(api_key, room_id, {until_id: message_id, count: NUMBER_OF_MESSAGES_TO_GET})(dispatch);
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
