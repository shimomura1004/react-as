import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import RoomMenu from './RoomMenu';
import RoomTextField from '../containers/RoomTextField';
import Message from './Message';
import AsSocket from '../helpers/AsSocket';
import '../styles/room.css';

export default class Room extends React.Component {
    constructor(props) {
        super(props);
        this.socket = new AsSocket(this.props.appendMessage, this.props.updateMessage, this.props.deleteMessage);
    }

    componentWillMount() {
        this.props.getRooms(this.props.api_key);

        if (this.props.room_id !== '') {
            this.props.getMessages(this.props.api_key, this.props.room_id);
            this.socket.subscribe(this.props.room_id);
        }
    }

    componentDidUpdate(prevProps) {
        // load messages and subscribe channel
        if (prevProps.room_id !== this.props.room_id) {
            this.props.getMessages(this.props.api_key, this.props.room_id);
            this.socket.subscribe(this.props.room_id);
        }

        // scroll to bottom when opening a room first time
        if (prevProps.messages.length === 0 && this.props.messages.length > 0) {
            let messages = document.querySelectorAll(".message");
            messages[messages.length - 1].scrollIntoView();
        }

        // scroll if the last message is in viewport
        if (JSON.stringify(prevProps.messages) !== JSON.stringify(this.props.messages)) {
            let messages = document.querySelectorAll(".message");

            if (messages.length >= 2) {
                let prev_latest_message = messages[messages.length - 2];
                let latest_message = messages[messages.length - 1];
                let rect = prev_latest_message.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    latest_message.scrollIntoView({behavior: "smooth"});
                }
            }
        }
    }

    render() {
        let messages = this.props.messages;
        let room = this.props.room;
        let room_name = room && room.name;

        return (
            <div>
                <RoomMenu room_name={room_name} rooms={this.props.rooms} setRoomId={this.props.setRoomId} logout={this.props.logout} />

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
                                {messages.map(key_message =>
                                    <Message key={key_message[0]} message={key_message[1]} />
                                )}
                            </div>
                        </div>

                        <RoomTextField />
                    </div>
                }
            </div>
        );
    }
};
