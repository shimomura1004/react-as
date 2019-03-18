import React, { Component } from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
import Room from '../containers/Room';
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

    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.isBottom = this.isBottom.bind(this);

    this.state = {
      start_y: 0,
      end_y: 0,
      reached_bottom: false,
    }
  }

  onTouchMove(e) {
    if (this.isBottom()) {
      if (!this.state.reached_bottom) {
        this.setState({
          ...this.state,
          start_y: e.touches[0].pageY,
          reached_bottom: true,
        });
      }
      else {
        this.setState({
          ...this.state,
          end_y: e.touches[0].pageY,
        });
      }
    }
    else {
      this.setState({
        ...this.state,
        reached_bottom: false,
      });
    }
  }

  onTouchEnd() {
    if (this.state.reached_bottom && this.state.end_y - this.state.start_y < - window.innerHeight / 4) {
      this.props.getMessages(this.props.api_key, this.props.room_id);
    }
    this.setState(state => ({
      reached_bottom: false,
    }));
  }

  isBottom() {
    return document.body.offsetHeight <= Math.ceil(window.innerHeight + window.pageYOffset);
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <p style={{"position": "fixed", "bottom":"3em", "right":"0", "color":"red"}}>{this.state.info}</p>
        <div className="App" onTouchMove={this.onTouchMove} onTouchEnd={this.onTouchEnd}>
          {
            (this.props.api_key) ? <Room /> : <Login />
          }
        </div>
      </MuiThemeProvider>
    );
  }
}
