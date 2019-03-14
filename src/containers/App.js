import {connect} from 'react-redux';
import App from '../components/App';

const mapStateToProps = state => ({
  api_key: state.app.api_key,
});

export default connect(mapStateToProps)(App);
