import React, { Component } from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
import Room from '../containers/Room.js';
import Login from '../containers/Login';

const theme = createMuiTheme({
  palette: {
    primary: red,
    secondary: blue,
  },
  typography: {
    useNextVariants: true,
  },
});

export default class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="App">
        {
          (this.props.api_key) ? <Room /> : <Login />
        }
        </div>
      </MuiThemeProvider>
    );
  }
}
