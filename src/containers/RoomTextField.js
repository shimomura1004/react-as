import {connect} from 'react-redux';
import RoomTextField from '../components/RoomTextField';
import { postMessage } from '../actions/Message';

const mapStateToProps = state => {
    const room = state.room.rooms[state.app.room_id];
    return {
        api_key: state.app.api_key,
        room_id: state.app.room_id,
        room_name: room && room.name,
        posting: room && room.posting,
    };
};

const mapDispatchToProps = (dispatch) => ({
    postMessage: (api_key, room_id, message) => {
        if (message !== "") {
            postMessage(api_key, room_id, message)(dispatch);
        }
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomTextField);
