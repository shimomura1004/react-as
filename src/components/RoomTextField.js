import React from 'react';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import '../styles/room.css';

export default class Room extends React.Component {
    render() {
        return (
            <div className="footer">
                <TextField
                    label={`Message #${this.props.room && this.props.room.name}`}
                    value={this.props.text_field}
                    multiline
                    rowsMax="3"
                    style={{
                        "margin": 0,
                        "backgroundColor": "white",
                        "width": "90%",
                    }}
                    variant="filled"
                    onChange={(e) => {
                        let text = e.currentTarget.value;
                        this.props.updateTextField(text);
                    }}
                    onKeyDown={ e => {
                        if (e.keyCode === 13 && !e.shiftKey) {
                            e.preventDefault();
                            this.props.postMessage(this.props.api_key, this.props.room_id, this.props.text_field);
                        }
                    }}
                />
                <div className="send-button">
                    <IconButton aria-label="Send" type="submit"
                        onClick={(e) => {
                            this.props.postMessage(this.props.api_key, this.props.room_id, this.props.text_field);
                    }}>
                        <SendIcon color="secondary" />
                    </IconButton>
                </div>
            </div>
        );
    }
};