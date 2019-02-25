import React from 'react';
import Message from './Message';

export default class Room extends React.Component {
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