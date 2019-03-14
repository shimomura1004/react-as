import React from 'react';
import io from 'socket.io-client';
import CircularProgress from '@material-ui/core/CircularProgress';
import RoomMenu from './RoomMenu';
import RoomTextField from './RoomTextField';
import Message from './Message';
import '../styles/room.css';

export default class Room extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            socket: io.connect(`${document.as['PUSHER_SERVER']}/?app=${document.as['PUSHER_APP_KEY']}`),
            channels: [],
        }
      }

    componentWillMount() {
        this.props.getRooms(this.props.api_key);

        if (this.props.room_id !== '') {
            this.props.getMessages(this.props.api_key, this.props.room_id);
            this.prepareWebsocket(this.props.room_id);
        }
    }

    componentDidUpdate(prevProp) {
        if (prevProp.room_id !== this.props.room_id) {
            this.props.getMessages(this.props.api_key, this.props.room_id);
            this.prepareWebsocket(this.props.room_id);
        }

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
        let messages = this.props.messages;
        let room = this.props.room;
        let room_name = room && room.name;

        return (
            <div>
                <RoomMenu room_id={this.props.room_id} room_name={room_name} rooms={this.props.rooms} setRoomId={this.props.setRoomId} logout={this.props.logout} />

                { this.props.room_id === ''
                    ? <p>select a room in a menu</p>
                    : <div>
                        <div className="chat-body">
                            <div className="messages-header" onClick={() => 
                                (messages.length > 0)
                                    ? this.props.loadMessages(this.props.loading, this.props.api_key, this.props.room_id, messages[0][1][0].id)
                                    : this.props.getMessages(this.props.api_key, this.props.room_id)
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

                        <RoomTextField
                            api_key={this.props.api_key}
                            room_id={this.props.room_id}
                            room_name={room_name}
                            postMessage={this.props.postMessage}
                        />
                    </div>
                }
            </div>
        );
    }
};
