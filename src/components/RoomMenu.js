import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ChatIcon from '@material-ui/icons/Chat';
import LockIcon from '@material-ui/icons/Lock';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import '../styles/room.css';

export default class Room extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
        };
    }

    onLogout = () => {
        this.props.logout();
        this.setState({open: false});
    }

    onRoomSelected = () => {
        this.setState({open: false});
    }

    handleDrawerOpen = () => {
        this.setState({open: true});
    };
    
    handleDrawerClose = () => {
        this.setState({open: false});
    };

    render() {
        // todo: swipeable drawer
        return (
            <div>
                <AppBar className="root" position="fixed" color="primary">
                    <Toolbar>
                        <IconButton
                            className="menuButton" color="inherit" aria-label="Menu"
                            onClick={this.handleDrawerOpen}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography className="grow" variant="h6" color="inherit">
                            {this.props.room && this.props.room.name}
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Drawer
                    anchor="left"
                    open={this.state.open}
                >
                    <div>
                        <IconButton onClick={this.handleDrawerClose}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </div>
                    <Divider />
                    <List>
                        {this.props.rooms.map(room => (
                            <ListItem button key={room.id} onClick={this.onRoomSelected}>
                                <ListItemIcon>
                                    { room.user === null ? <ChatIcon /> : <LockIcon /> }
                                </ListItemIcon>
                                <ListItemText primary={room.name} />
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        <ListItem button key="logout" onClick={this.onLogout}>
                            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItem>
                    </List>
                </Drawer>
            </div>
        );
    }
};