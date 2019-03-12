import {connect} from 'react-redux';
import App from '../components/App';
import { setApiKey, setRoomId } from '../actions/App';
import { getRooms, appendMessage, updateMessage, deleteMessage } from '../actions/Room';

const mapStateToProps = state => ({
  api_key: state.app.api_key,
  room_id: state.app.room_id,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
