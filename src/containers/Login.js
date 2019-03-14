import {connect} from 'react-redux';
import Login from '../components/Login';
import { setApiKey } from '../actions/App';

const mapStateToProps = state => ({
  api_key: state.app.api_key,
});

const mapDispatchToProps = dispatch => ({
  setApiKey: (api_key) => {
    setApiKey(api_key)(dispatch);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
