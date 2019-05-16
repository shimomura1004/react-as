import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export default class EditDialog extends React.Component {
    constructor(props) {
        super(props);

        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleUpdate() {
        let text_field = document.querySelector("#text_field_for_updating");
        this.props.updateMessage(this.props.api_key, this.props.message.id, text_field.value);
        this.props.handleClose();
    }

    handleDelete(message_id) {
        this.props.deleteMessage(this.props.api_key, this.props.message.id);
        this.props.handleClose();
    }

    render() {
        let message = this.props.message;

        return (<div>
            <Dialog
                fullScreen
                open={this.props.open}
                TransitionComponent={Transition}
            >
                <AppBar>
                    <Toolbar>
                        <IconButton color="inherit" onClick={this.props.handleClose} aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit">
                            Message
                        </Typography>
                    </Toolbar>
                </AppBar>
                {
                    message
                        ?   <div className="message" style={{marginTop: this.props.menu_height}}>
                                <img className="icon" src={message.profile_image_url} alt={message.name} />
                                <div className="content">
                                    <div className="profile">
                                        <span className="user-name">{message.name}</span>
                                    </div>
                                    <p
                                        className="body"
                                        dangerouslySetInnerHTML={{__html: message.html_body}}
                                    >
                                    </p>
                                    {
                                        this.props.screen_name === message.screen_name
                                            // ? <p>{message.body}</p>
                                            ?  <div>
                                                <TextField
                                                    id="text_field_for_updating"
                                                    multiline
                                                    fullWidth
                                                    rows="3"
                                                    margin="normal"
                                                    variant="filled"
                                                    defaultValue={message.body}
                                                />
                                                <Button variant="contained" color="primary" size="small" onClick={this.handleDelete}>
                                                    Delete
                                                    <DeleteIcon />
                                                </Button>
                                                <Button variant="contained" color="secondary" size="small" onClick={this.handleUpdate}>
                                                    Save
                                                    <SaveIcon />
                                                </Button>
                                            </div>
                                            : <div />
                                    }
                                </div>
                            </div>
                        :   <div />
                }
            </Dialog>
            </div>
        );
    }
};