import {connect} from 'react-redux';
import App from '../components/App';
import { setApiKey, setRoomId } from '../actions/App';
import { getRooms } from '../actions/Room';

const mapStateToProps = state => ({
  api_key: state.app.api_key,
});

const mapDispatchToProps = dispatch => ({
  setApiKey: (api_key) => {
    setApiKey(api_key)(dispatch);
  },
  setRoomId: (room_id) => {
    setRoomId(room_id)(dispatch);
  },
  getRooms: (api_key) => {
    getRooms(api_key)(dispatch);
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
