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
                    id="text_field"
                    label={`Message #${this.props.room_name}`}
                    multiline
                    rowsMax="3"
                    style={{
                        "margin": 0,
                        "backgroundColor": "white",
                        "width": "90%",
                    }}
                    variant="filled"
                    onKeyDown={ e => {
                        if (e.keyCode === 13 && !e.shiftKey) {
                            e.preventDefault();
                            const text = document.getElementById("text_field").value;
                            this.props.postMessage(this.props.api_key, this.props.room_id, text);
                        }
                    }}
                />
                <div className="send-button">
                    <IconButton aria-label="Send" type="submit"
                        onClick={(e) => {
                            const text = document.getElementById("text_field").value;
                            this.props.postMessage(this.props.api_key, this.props.room_id, text);
                    }}>
                        <SendIcon color="secondary" />
                    </IconButton>
                </div>
            </div>
        );
    }
};