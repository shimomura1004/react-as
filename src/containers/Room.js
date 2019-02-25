import {connect} from 'react-redux';
import Room from '../components/Room.js';
import { getMessages } from '../actions/Message';
import { find_room } from '../helpers/Room';

// todo: shoud we have to pass the api_key to the view?
const mapStateToProps = state => ({
    api_key: state.get('api_key'),

    loading: state.get('message_loading') || state.get('room_loading'),
    room: find_room(state.get('rooms'), state.get('room_id')),
    messages: state.get('combined_messages').toJS(),
});

const mapDispatchToProps = (dispatch) => ({
    load_messages: (api_key, room_id, message_id) => {
        getMessages(api_key, room_id, {until_id: message_id, count: 20})(dispatch);
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);
