import React, { Component } from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
import Room from '../containers/Room.js';

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
    let account_url = `${document.as['ORIGINAL_API_SERVER']}/account/index`;
    return (
      <MuiThemeProvider theme={theme}>
        <div className="App">
        {
          (this.props.api_key)
            ? <Room />
            : <div>
                <p>Access your account and get API key</p>
                <p><a href={account_url}>{account_url}</a></p>
                <form onSubmit={ e => {
                  e.preventDefault();
                  const api_key = document.getElementById("api_key").value;
                  const room_id = document.getElementById("room_id").value;
                  this.props.setApiKey(api_key);
                  this.props.setRoomId(room_id);
                }}>
                  <div>
                    <label>API Key</label>
                    <input id="api_key" type="text" />
                  </div>
                  <div>
                    <label>Room ID</label>
                    <input id="room_id" type="text" />
                  </div>
                  <input type="submit" value="set" />
                </form>
              </div>
        }
        </div>
      </MuiThemeProvider>
    );
  }
}
