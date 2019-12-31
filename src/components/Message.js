import React from 'react';
import '../styles/message.css';

export default class Message extends React.Component {
    constructor(props) {
        super(props);

        this.messages = props.message;
        this.first_message = this.messages[0];

        this.loadMessagesInGap = this.loadMessagesInGap.bind(this);
        this.createTagForAttachment = this.createTagForAttachment.bind(this);
    }

    loadMessagesInGap() {
        this.props.loadMessagesInGap(this.first_message.id);
    }

    createTagForAttachment(content_type, src) {
        const type = content_type.split("/")[0];
        switch (type) {
        case 'image':
            return <img src={src} />;
        case 'video':
            return <video src={src} controls />;
        default:
            console.log("Unknown content type: ", content_type);
            return
                <div>
                    <p>Unknown type: {content_type}</p>
                    <p>{src}</p>
                </div>;
        }
    }

    // todo: create component for gap_marker, message and attached file
    render() {
        if (this.messages.length === 1 && this.first_message.gap_marker) {
            return (
                <div className="messages-header" onClick={this.loadMessagesInGap}>
                    <p>Load messages</p>
                </div>
            )
        }

        let date = new Date(this.first_message.created_at);
        let MM = ("0" + date.getMonth()).slice(-2);
        let dd = ("0" + date.getDate()).slice(-2);
        let hh = ("0" + date.getHours()).slice(-2);
        let mm = ("0" + date.getMinutes()).slice(-2);
        let time_string = `${MM}/${dd} ${hh}:${mm}`;

        return (
            <div className="message">
                <img className="icon" src={this.first_message.profile_image_url} alt={this.first_message.name} />
                <div className="content">
                    <div className="profile">
                        <span className="user-name">{this.first_message.name}</span>
                        <span className="time">{time_string}</span>
                    </div>
                    {
                        this.messages.map(message => {
                            if (message.attachment.length > 0) {
                                return (
                                    <div key={message.id + message.timestamp}>
                                        {
                                            message.attachment.map(file =>
                                                <div key={file.url}>
                                                    { this.createTagForAttachment(file.content_type, file.url) }
                                                    <p><a href={file.url}>{file.filename}</a></p>
                                                </div>
                                            )
                                        }
                                    </div>
                                );
                            }

                            return (
                                <div key={message.id + message.timestamp}>
                                    <p
                                        className="body"
                                        dangerouslySetInnerHTML={{__html: message.html_body}}
                                        onClick={(e) => this.props.handleClick(e, message)}
                                    >
                                    </p>
                                </div>
                            );
                        })
                    }
                </div>
                <span className="clear"></span>
            </div>
        );
    }
};