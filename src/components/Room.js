import React from 'react';
import Message from './Message';
import io from 'socket.io-client'

export default class Room extends React.Component {
    componentWillMount() {
        console.log("CONNECTING!")
        let socket = io.connect("https://keima.herokuapp.com/?app=(your keima key here)");
        socket.emit("subscribe", "as-(room id)");
        socket.on("message_create", (channel, data) => {
            var obj = JSON.parse(data);
            console.log(obj);
        });
    }

    render() {
        let messages = this.props.messages;
        return (
            <div onClick={() =>
                this.props.load_messages(this.props.api_key, this.props.room.id, messages[0][0].id)
            }>
                <p>{this.props.room && this.props.room.name}</p>
                <p>{this.props.loading ? 'LOADING' : 'LOADED'}</p>
                <div>
                    {messages.map((message) => <Message key={message[0].id} message={message} />)}
                </div>
            </div>
        );
    }
};
