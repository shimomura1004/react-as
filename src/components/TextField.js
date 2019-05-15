import React from 'react';
import Measure from 'react-measure';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import CloudOffIcon from '@material-ui/icons/CloudOff';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../styles/room.css';

export default class Room extends React.Component {
    render() {
        return (
            <Measure
                bounds
                onResize={contentRect => {
                    this.props.updateTextFieldHeight(this.props.room_id, contentRect.bounds.height);
                }}
            >
            {({ measureRef }) => (
                <div className="footer" ref={measureRef}>
                    <TextField
                        className="text-field"
                        placeholder={`Message #${this.props.room_name}`}
                        multiline
                        variant="filled"
                        rowsMax="3"
                        onChange={ e => this.props.updateTextField(this.props.room_id, e.currentTarget.value) }
                        onKeyDown={ e => {
                            if (e.keyCode === 13 && !e.shiftKey) {
                                e.preventDefault();
                                if (!this.props.posting && this.props.websocket_connected) {
                                    this.props.postMessage(this.props.api_key, this.props.room_id, this.props.text_field);
                                }
                            }
                        }}
                        value={this.props.text_field}
                    />
                    <div className="send-button">
                        {
                            this.props.websocket_connected
                                ? (this.props.posting
                                        ? <CircularProgress className="button" />
                                        : <IconButton aria-label="Send" type="submit" className="button"
                                            onClick={(e) => {
                                                this.props.postMessage(this.props.api_key, this.props.room_id, this.props.text_field);
                                        }}>
                                            <SendIcon color="secondary" className="button" />
                                        </IconButton>
                                )
                                : <CloudOffIcon className="button" />
                        }
                    </div>
                </div>
            )}
            </Measure>
        );
    }
};