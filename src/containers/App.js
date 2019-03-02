import {connect} from 'react-redux';
import App from '../components/App';
import { setApiKey } from '../actions/App';

const mapStateToProps = state => ({
  api_key: state.get('api_key'),
});

const mapDispatchToProps = dispatch => ({
  setApiKey: (api_key) => {
    setApiKey(api_key)(dispatch);
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
