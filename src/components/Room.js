import React from 'react';
import Menu from '../containers/Menu';
import ChatBody from '../containers/ChatBody';
import Snackbar from '@material-ui/core/Snackbar';
import '../styles/room.css';

export default class Room extends React.Component {
    render() {
        return (
            <div>
                <Menu />
                <ChatBody />
                <Snackbar
                    anchorOrigin={{vertical: "top", horizontal: "center"}}
                    open={this.props.notification_open}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={this.props.notification_content}
                />
            </div>
        );
    }
};
