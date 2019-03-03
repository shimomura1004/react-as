import React from 'react';
import io from 'socket.io-client';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SendIcon from '@material-ui/icons/Send';
import Message from './Message';
import '../styles/room.css';

export default class Room extends React.Component {
    componentWillMount() {
        this.props.getRooms(this.props.api_key);
        this.props.getMessages(this.props.api_key, this.props.room_id);

        let socket = io.connect(`${document.as['PUSHER_SERVER']}/?app=${document.as['PUSHER_APP_KEY']}`);
        socket.emit("subscribe", "as-(room id)");
        socket.on("message_create", (channel, data) => {
            let message = JSON.parse(data).content;
            this.props.appendMessage(message);
        });
        socket.on("message_update", (channel, data) => {
            let message = JSON.parse(data).content;
            this.props.updateMessage(message);
        });
        socket.on("message_delete", (channel, data) => {
            var id = JSON.parse(data).content.id;
            this.props.deleteMessage(id);
        });
    }

    componentDidUpdate(prevProp) {
        let messages = document.querySelectorAll(".message");
        if (messages.length === 0) {
            return;
        }
        if (JSON.stringify(prevProp.messages) === JSON.stringify(this.props.messages)) {
            return;
        }

        let index = messages.length;
        messages[index - 1].scrollIntoView();
    }

    render() {
        let messages = this.props.messages;
        return (
            <div>
                <AppBar className="root" position="fixed" color="primary">
                    <Toolbar>
                        <IconButton className="menuButton" color="inherit" aria-label="Menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography className="grow" variant="h6" color="inherit">
                            {this.props.room && this.props.room.name}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <div className="chat-body" onClick={() =>
                    this.props.loadMessages(this.props.loading, this.props.api_key, this.props.room_id, messages[0][1][0].id)
                }>
                    <p>{this.props.loading ? 'LOADING' : 'LOADED'}</p>
                    <div>
                        {messages.map(timestamp_message =>
                            <Message key={timestamp_message[0] + timestamp_message[1][0].id} message={timestamp_message[1]} />
                        )}
                    </div>
                </div>
                <div className="footer">
                    <TextField
                        label={`Message #${this.props.room && this.props.room.name}`}
                        value={this.props.text_field}
                        multiline
                        rowsMax="3"
                        style={{
                            "margin": 0,
                            "backgroundColor": "white",
                            "width": "90%",
                        }}
                        variant="filled"
                        onChange={(e) => {
                            let text = e.currentTarget.value;
                            this.props.updateTextField(text);
                        }}
                        onKeyDown={ e => {
                            if (e.keyCode === 13 && !e.shiftKey) {
                                e.preventDefault();
                                this.props.postMessage(this.props.api_key, this.props.room_id, this.props.text_field);
                            }
                        }}
                    />
                    <div className="send-button">
                        <IconButton aria-label="Send" type="submit"
                            onClick={(e) => {
                                this.props.postMessage(this.props.api_key, this.props.room_id, this.props.text_field);
                        }}>
                            <SendIcon color="secondary" />
                        </IconButton>
                    </div>
                </div>
            </div>
        );
    }
};
