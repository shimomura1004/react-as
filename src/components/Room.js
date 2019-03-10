import React from 'react';
import io from 'socket.io-client';
import CircularProgress from '@material-ui/core/CircularProgress';
import RoomMenu from './RoomMenu';
import RoomTextField from './RoomTextField';
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
                <RoomMenu room={this.props.room} />

                <div className="chat-body">
                    <div className="messages-header" onClick={() =>
                        this.props.loadMessages(this.props.loading, this.props.api_key, this.props.room_id, messages[0][1][0].id)
                    }>
                        {
                            this.props.loading
                                ? <CircularProgress />
                                : <p>Load messages</p>
                        }
                    </div>
                    <div>
                        {messages.map(timestamp_message =>
                            <Message key={timestamp_message[0] + timestamp_message[1][0].id} message={timestamp_message[1]} />
                        )}
                    </div>
                </div>

                <RoomTextField />
            </div>
        );
    }
};
