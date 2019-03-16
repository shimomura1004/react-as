import {connect} from 'react-redux';
import App from '../components/App';
import { getMessages } from '../actions/Message';

const mapStateToProps = state => ({
  api_key: state.app.api_key,
  room_id: state.app.room_id,
});

const mapDispatchToProps = (dispatch) => ({
  getMessages: (api_key, room_id) => {
    getMessages(api_key, room_id)(dispatch);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
