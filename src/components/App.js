import io from 'socket.io-client';
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
  constructor(props) {
    super(props);

    this.state = {
      socket: io.connect(`${document.as['PUSHER_SERVER']}/?app=${document.as['PUSHER_APP_KEY']}`),
      channels: [],
    }
  }

  componentWillMount() {
    if (this.props.api_key !== '') {
      this.props.getRooms(this.props.api_key);
    }

    if (this.props.room_id !== '') {
      this.prepareWebsocket(this.props.room_id);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.room_id !== this.props.room_id) {
      this.prepareWebsocket(this.props.room_id);
    }
  }

  // todo: create websocket helper
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
