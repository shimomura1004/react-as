import {connect} from 'react-redux';
import Menu from '../components/Menu';
import { setRoomId, logout } from '../actions/App';
import { getRooms, setScrollPosition } from '../actions/Room';

const mapStateToProps = state => {
    let rooms = Object.keys(state.room.rooms).sort().map(id => state.room.rooms[id]);
    let room = state.room.rooms[state.app.room_id];

    return {
        api_key: state.app.api_key,
        room_id: state.app.room_id,
        rooms,
        room,
    };
};

const mapDispatchToProps = (dispatch) => ({
    getRooms: (api_key) => {
        getRooms(api_key)(dispatch);
    },
    setRoomId: (room_id) => {
        setRoomId(room_id)(dispatch);
    },
    setScrollPosition: (room_id, scroll_position) => {
        setScrollPosition(room_id, scroll_position)(dispatch);
    },
    logout: () => {
        logout()(dispatch);
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
