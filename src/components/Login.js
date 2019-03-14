import React from 'react';

export default class Login extends React.Component {
    render() {
        let account_url = `${document.as['ORIGINAL_API_SERVER']}/account/index`;
        return (
            <div>
                <p>Access your account and get API key</p>
                <p><a href={account_url}>{account_url}</a></p>
                <form onSubmit={ e => {
                    e.preventDefault();
                    const api_key = document.getElementById("api_key").value;
                    this.props.setApiKey(api_key);
                }}>
                    <div>
                        <label>API Key</label>
                        <input id="api_key" type="text" />
                    </div>
                <input type="submit" value="set" />
            </form>
        </div>
        );
    }
};
