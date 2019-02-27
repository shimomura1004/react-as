import React from 'react';
import io from 'socket.io-client'
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import Message from './Message';
import '../styles/room.css';

export default class Room extends React.Component {
    componentWillMount() {
        console.log("CONNECTING!")
        let socket = io.connect(`${document.as['PUSHER_SERVER']}/?app=${document.as['PUSHER_APP_KEY']}`);
        socket.emit("subscribe", "as-(room id)");
        socket.on("message_create", (channel, data) => {
            var obj = JSON.parse(data);
            console.log("CREATED", obj);
        });
        socket.on("message_update", (channel, data) => {
            var obj = JSON.parse(data);
            console.log("UPDATED", obj);
        });
        socket.on("message_delete", (channel, data) => {
            var obj = JSON.parse(data);
            console.log("DELETED", obj);
        });
    }

    render() {
        let messages = this.props.messages;
        return (
            <div>
                <div className="chat-body" onClick={() =>
                    this.props.loadMessages(this.props.loading, this.props.api_key, this.props.room.id, messages[0][0].id)
                }>
                    <p>{this.props.room && this.props.room.name}</p>
                    <p>{this.props.loading ? 'LOADING' : 'LOADED'}</p>
                    <div>
                        {messages.map((message) => <Message key={message[0].id} message={message} />)}
                    </div>
                </div>
                <div className="footer">
                    <TextField
                        label={`Message #${this.props.room && this.props.room.name}`}
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
                    />
                    <div className="send-button">
                    <IconButton aria-label="Send" onClick={(e) => {
                        this.props.postMessage(this.props.api_key, this.props.room.id, this.props.textfield);
                    }}>
                        <SendIcon />
                    </IconButton>
                    </div>
                </div>
            </div>
        );
    }
};
