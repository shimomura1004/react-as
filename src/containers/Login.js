import {connect} from 'react-redux';
import Login from '../components/Login';
import { getUserInfo } from '../actions/App';

const mapStateToProps = state => ({
  api_key: state.app.api_key,
});

const mapDispatchToProps = dispatch => ({
  getUserInfo: (api_key) => {
    getUserInfo(api_key)(dispatch);
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
