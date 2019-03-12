import io from 'socket.io-client';
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
  constructor(props) {
    super(props);

    this.state = {
      socket: io.connect(`${document.as['PUSHER_SERVER']}/?app=${document.as['PUSHER_APP_KEY']}`),
      channels: [],
    }
  }

  componentWillMount() {
    this.props.getRooms(this.props.api_key);

    if (this.props.room_id !== '') {
      this.prepareWebsocket(this.props.room_id);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.room_id !== this.props.room_id) {
      this.prepareWebsocket(this.props.room_id);
    }
  }

  prepareWebsocket(room_id) {
    if (this.state.channels.indexOf(room_id) === -1) {
      console.log("connect to " + room_id)
      this.state.channels.push(room_id);

      this.state.socket.emit("subscribe", `as-${room_id}`);
      this.state.socket.on("message_create", (channel, data) => {
          let message = JSON.parse(data).content;
          this.props.appendMessage(message);
      });
      this.state.socket.on("message_update", (channel, data) => {
          let message = JSON.parse(data).content;
          this.props.updateMessage(message);
      });
      this.state.socket.on("message_delete", (channel, data) => {
          var message_id = JSON.parse(data).content.id;
          this.props.deleteMessage(message_id, room_id);
      });
    }
  }

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
                  this.props.setApiKey(api_key);
                }}>
                  <div>
                    <label>API Key</label>
                    <input id="api_key" type="text" />
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
