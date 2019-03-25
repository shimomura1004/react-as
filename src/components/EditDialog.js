import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export default class Message extends React.Component {
    render() {
        return (
            <Dialog
                fullScreen
                open={this.props.open}
                TransitionComponent={Transition}
            >
                <h1 onClick={this.props.handleClose}>DIALOG!</h1>
                <p>{this.props.message && this.props.message.body}</p>
            </Dialog>
        );
    }
};