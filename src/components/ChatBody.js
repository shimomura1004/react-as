import React from 'react';
import TextField from '../containers/TextField';
import Message from './Message';
import EditDialog from './EditDialog';
import AsSocket from '../helpers/AsSocket';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../styles/room.css';

export default class ChatBody extends React.Component {
    constructor(props) {
        super(props);

        this.socket = new AsSocket(
            this.props.appendMessageInView,
            this.props.updateMessageInView,
            this.props.deleteMessageInView,
            () => {
                this.props.websocketConnected();
                if (this.props.room_id) {
                    this.props.getMessages(this.props.loading, this.props.api_key, this.props.room_id);
                }
            },
            this.props.websocketDisconnected()
        );

        // todo: move these functions to EditDialog?
        this.handleClick = this.handleClick.bind(this);
        this.loadMessagesInGap = this.loadMessagesInGap.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            edit_dialog_open: false,
            message: undefined,
        };

        this.loadMoreMessages = this.loadMoreMessages.bind(this)

        this.offset = 0;
    }

    handleClick(e, message) {
        if (e.target.tagName === "A" && e.target.href) {
            return;
        }

        this.setState({edit_dialog_open: true, message});
    }

    loadMessagesInGap(gap_marker_id) {
        this.props.getMessagesInGap(this.props.loading, this.props.api_key, this.props.room_id, gap_marker_id);
    }

    handleClose() {
        this.setState({edit_dialog_open: false, message: undefined});
    }

    componentWillMount() {
        if (this.props.room_id !== '') {
            this.socket.subscribe(this.props.room_id);
            this.props.getMessages(this.props.loading, this.props.api_key, this.props.room_id);
        }
    }

    componentWillUpdate(prevProps) {
        this.offset = document.body.clientHeight - window.pageYOffset;
    }

    componentDidUpdate(prevProps) {
        const switching_room = prevProps.room_id !== this.props.room_id;
        const first_time = prevProps.messages.length === 0 && this.props.messages.length > 0;
        const message_changed = JSON.stringify(prevProps.messages) !== JSON.stringify(this.props.messages);

        if (switching_room) {
            this.props.getMessages(this.props.loading, this.props.api_key, this.props.room_id);
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

        // scroll to keep position when receiving old messages
        // todo: better way to distinguish appending and "read more"
        if (this.props.messages.length - prevProps.messages.length > 1) {
            window.scrollTo(0, document.body.clientHeight - this.offset);
        }

        // scroll messages when textfield expands
        const height_diff = this.props.text_field_height - prevProps.text_field_height;
        if (height_diff > 0) {
            window.scrollBy(0, height_diff);
        }
    }

    loadMoreMessages() {
        let messages = this.props.messages;

        if (messages.length > 0) {
            this.props.loadMessages(this.props.loading, this.props.api_key, this.props.room_id, messages[0][1][0].id);
        }
        else {
            this.props.getMessages(this.props.loading, this.props.api_key, this.props.room_id);
        }
    }

    render() {
        let messages = this.props.messages;
        let load_messages_tag = this.props.loading
            ? <CircularProgress />
            : <p>Load messages</p>;

        return (
            <div>
                { this.props.room_id === ''
                    ? <p>select a room in a menu</p>
                    : <div>
                        <div className="chat-body" style={{marginBottom: this.props.text_field_height, marginTop: this.props.menu_height}}>
                            <div className="messages-header" onClick={this.loadMoreMessages}>
                                { load_messages_tag }
                            </div>
                            <div>
                                {messages.map(key_message =>
                                    <Message key={key_message[0]} message={key_message[1]} handleClick={this.handleClick} loadMessagesInGap={this.loadMessagesInGap} />
                                )}
                            </div>
                        </div>

                        <TextField />

                        <EditDialog
                            open={this.state.edit_dialog_open}
                            api_key={this.props.api_key}
                            screen_name={this.props.screen_name}
                            message={this.state.message}
                            menu_height={this.props.menu_height}
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
