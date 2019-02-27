import React from 'react';
import '../styles/message.css';

export default class Message extends React.Component {
    constructor(props) {
        super(props);
        this.messages = props.message;
        this.first_message = this.messages[0];
    }

    render() {
        return (
            <div className="message">
                <img className="icon" src={this.first_message.profile_image_url} alt={this.first_message.name} />
                <div className="content">
                    <div className="profile">
                        <span className="user-name">{this.first_message.name}</span>
                        <span className="time">{this.first_message.created_at}</span>
                    </div>
                    { this.messages.map((message) => <p key={message.id} className="body" dangerouslySetInnerHTML={{__html: message.html_body}}></p>) }
                </div>
                <span className="clear"></span>
            </div>
        );
    }
};