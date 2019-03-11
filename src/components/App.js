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
  componentWillMount() {
    this.props.getRooms(this.props.api_key);
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
