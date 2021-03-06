import React, {Component, createContext} from "react";
import secureApiFetch from '../services/api';

const AuthContext = createContext()

class AuthProvider extends Component {

    state = {
        isAuth: false
    }

    constructor() {
        super();
        this.login = this.login.bind(this)
        this.logout = this.logout.bind(this)

        this.state.isAuth = localStorage.getItem('isAuth');
        this.state.user = JSON.parse(localStorage.getItem('user'));
    }

    login(credentials, onOk, onKo) {
        const formData = new FormData();
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);
        secureApiFetch(`/users/login`, {
            method: 'POST',
            body: formData
        })
            .then(resp => {
                if (resp.status === 403) {
                    throw new Error('Invalid username or password');
                }
                if (resp.status !== 200) {
                    throw new Error('Invalid response from the server');
                }
                return resp.json();
            })
            .then((data) => {
                localStorage.setItem("accessToken", data.access_token);
                localStorage.setItem('isAuth', true);
                localStorage.setItem('user.id', data.id);
                localStorage.setItem('user', JSON.stringify(data));
                this.setState({isAuth: true, user: data});
                onOk();
            })
            .catch((err) => {
                onKo(err.message);
            });

    }

    logout() {
        this.setState({isAuth: false})
        secureApiFetch(`/users/logout`, {
            method: 'POST',
        })
            .finally(() => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('isAuth');
                localStorage.removeItem('user.id');
                localStorage.removeItem('user');
            });
    }

    render() {
        return (
            <AuthContext.Provider value={{
                isAuth: this.state.isAuth,
                login: this.login,
                logout: this.logout,
                user: this.state.user
            }}>
                {this.props.children}
            </AuthContext.Provider>
        )
    }
}

const AuthConsumer = AuthContext.Consumer

export {AuthProvider, AuthConsumer}
