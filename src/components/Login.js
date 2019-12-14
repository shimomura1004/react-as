import React from 'react';
import { API_SERVER } from '../config';

// todo: loading icon while getting user info
export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.unregisterServiceWorker = this.unregisterServiceWorker.bind(this);
    }

    unregisterServiceWorker() {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            for(let registration of registrations) {
                registration.unregister();
                localStorage.removeItem("api_server");
                localStorage.removeItem("pusher_server");
                localStorage.removeItem("pusher_api_key");
            }
        });
        alert("ServiceWorker is unregistered");
        location.reload();
    }

    render() {
        let account_url = `${API_SERVER}/account/index`;
        return (
            <div>
                <p>Access your account and get API key</p>
                <p><a href={account_url}>{account_url}</a></p>
                <form onSubmit={ e => {
                    e.preventDefault();
                    const api_key = document.getElementById("api_key").value;
                    this.props.getUserInfo(api_key);
                }}>
                    <div>
                        <label>API Key</label>
                        <input id="api_key" type="text" />
                    </div>
                <input type="submit" value="set" />
            </form>
            <p onClick={this.unregisterServiceWorker}>CLEAR</p>
        </div>
        );
    }
};
