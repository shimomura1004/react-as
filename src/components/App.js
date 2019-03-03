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
                  this.props.setApiKey(document.api_key);
                }}>
                  <input type="text" onChange={e => document.api_key = e.currentTarget.value} />
                  <input type="submit" value="set" />
                </form>
              </div>
        }
        </div>
      </MuiThemeProvider>
    );
  }
}
