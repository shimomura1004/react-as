import React from 'react';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import CircularProgress from '@material-ui/core/CircularProgress';
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
                    onChange={ (e) => this.props.updateTextField(this.props.room_id, e.currentTarget.value) }
                    onKeyDown={ e => {
                        if (e.keyCode === 13 && !e.shiftKey && !this.props.posting) {
                            e.preventDefault();
                            this.props.postMessage(this.props.api_key, this.props.room_id, this.props.text_field);
                        }
                    }}
                    value={this.props.text_field}
                />
                <div className="send-button">
                    {
                        this.props.posting
                            ? <CircularProgress />
                            : <IconButton aria-label="Send" type="submit"
                                onClick={(e) => {
                                    this.props.postMessage(this.props.api_key, this.props.room_id, this.props.text_field);
                              }}>
                                <SendIcon color="secondary" />
                            </IconButton>
                    }
                </div>
            </div>
        );
    }
};