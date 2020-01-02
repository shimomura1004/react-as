import {connect} from 'react-redux';
import Room from '../components/Room.js';

const mapStateToProps = state => {
    if (state.app.room_id === '' || Object.keys(state.room.rooms).length === 0) {
        return {
            notification_open: false,
            notification_content: "",
        };
    }

    return {
        notification_open: state.room.notification_open,
        notification_content: state.room.notification_content,
    };
};

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);
