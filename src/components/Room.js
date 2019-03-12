import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import RoomMenu from './RoomMenu';
import RoomTextField from './RoomTextField';
import Message from './Message';
import '../styles/room.css';

export default class Room extends React.Component {
    componentWillMount() {
        if (this.props.room_id !== '') {
            this.props.getMessages(this.props.api_key, this.props.room_id);
        }
    }

    componentDidUpdate(prevProp) {
        if (prevProp.room_id !== this.props.room_id) {
            this.props.getMessages(this.props.api_key, this.props.room_id);
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
