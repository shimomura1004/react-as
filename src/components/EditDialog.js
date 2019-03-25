import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export default class EditDialog extends React.Component {
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
                        ?   <div className="message" style={{marginTop: "3.5em"}}>
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
                                    <br/>
                                    <p>{message.body}</p>
                                </div>
                            </div>
                        :   <div />
                }
            </Dialog>
            </div>
        );
    }
};