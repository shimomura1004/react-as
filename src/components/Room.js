import React from 'react';
import Menu from '../containers/Menu';
import TextField from '../containers/TextField';
import Message from './Message';
import EditDialog from './EditDialog';
import AsSocket from '../helpers/AsSocket';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../styles/room.css';

export default class Room extends React.Component {
    constructor(props) {
        super(props);

        this.socket = new AsSocket(
            this.props.appendMessageInView,
            this.props.updateMessageInView,
            this.props.deleteMessageInView,
            () => {
                this.props.websocketConnected();
                if (this.props.room_id) {
                    this.props.getMessages(this.props.api_key, this.props.room_id);
                }
            },
            this.props.websocketDisconnected
        );

        // todo: move these functions to EditDialog?
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            open: false,
            message: undefined,
        };
    }

    handleClick(message) {
        this.setState({open: true, message});
    }

    handleClose() {
        this.setState({open: false, message: undefined});
    }

    componentWillMount() {
        if (this.props.room_id !== '') {
            this.socket.subscribe(this.props.room_id);
        }
    }

    componentDidUpdate(prevProps) {
        const switching_room = prevProps.room_id !== this.props.room_id;
        const first_time = prevProps.messages.length === 0 && this.props.messages.length > 0;
        const message_changed = JSON.stringify(prevProps.messages) !== JSON.stringify(this.props.messages);

        if (switching_room) {
            this.props.getMessages(this.props.api_key, this.props.room_id);
            this.socket.subscribe(this.props.room_id);
            window.scrollTo(0, this.props.scroll_position);
        }

        // scroll to bottom when opening a room first time
        if (first_time) {
            let messages = document.querySelectorAll("div.content p.body");
            messages[messages.length - 1].scrollIntoView();
        }

        // scroll to view the latest message when receiving new messages
        // if the previous last message is in viewport
        if (message_changed) {
            let messages = document.querySelectorAll("div.content p.body");

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

        return (
            <div>
                <Menu />
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
                                    <Message key={key_message[0]} message={key_message[1]} handleClick={this.handleClick} />
                                )}
                            </div>
                        </div>

                        <TextField />

                        <EditDialog
                            open={this.state.open}
                            api_key={this.props.api_key}
                            screen_name={this.props.screen_name}
                            message={this.state.message}
                            handleClose={this.handleClose}
                            updateMessage={this.props.updateMessage}
                            deleteMessage={this.props.deleteMessage}
                        />
                    </div>
                }
            </div>
        );
    }
};
