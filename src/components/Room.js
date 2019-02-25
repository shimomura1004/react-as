import React from 'react';
import io from 'socket.io-client'
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

    // todo: use nice UI toolkit for text field
    render() {
        let messages = this.props.messages;
        return (
            <div>
                <div onClick={() =>
                    this.props.loadMessages(this.props.api_key, this.props.room.id, messages[0][0].id)
                }>
                    <p>{this.props.room && this.props.room.name}</p>
                    <p>{this.props.loading ? 'LOADING' : 'LOADED'}</p>
                    <div>
                        {messages.map((message) => <Message key={message[0].id} message={message} />)}
                    </div>
                </div>
                <textarea autoFocus="autofocus" placeholder="Input message here"></textarea>
            </div>
        );
    }
};
