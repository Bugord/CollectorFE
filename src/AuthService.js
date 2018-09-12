import axios from 'axios';
import decode from 'jwt-decode';
import Conf from './Configuration'
import {store} from './index'
import { userLogin, userLogout } from './Actions/userActions'

export default class AuthService{
    static register(email, username, password, firstName, lastName,callback){ 
        axios.post(Conf.domain + 'api/register', {
            email : email,
            username: username,
            password : password,
            firstName : firstName,
            lastName : lastName
        }).then(res => {
            AuthService.setToken(res.data.data.token);
            AuthService.setUser(res.data.data.user);
            callback();
        })
        .catch(res => 
            {
                var message = AuthService.handleException(res);
                callback(message);                    
            });
    };
    static addFriend(name)
    {
        this.updateAuthHeader();

        axios.post(Conf.domain + 'api/addFriend', {
            name : name
        }).then(res => {
        })
        .catch(res => 
            {
            });
    }
    static login(email, password, callback){ 
        axios.post(Conf.domain + 'api/login', {
            email : email,
            password : password}
        ).then(res => {
            AuthService.setToken(res.data.data.token);
            AuthService.setUser(res.data.data.user);
            callback();
        })
        .catch(res => 
            {
                var message = AuthService.handleException(res);
                callback(message);
            });
    };

    static handleException(res)
    {
        if(res.response === undefined)
            return res.message;
        if(res.response.data.message !== undefined)
            return res.response.data.message;
        else return "Network error";
    }

    static request(url, data) {
        this.updateAuthHeader()
        return axios.post(Conf.domain + url, data);        
    }

    static loggedIn()
    {
        const token = AuthService.getToken();
        return !!token && !AuthService.isTokenExpired(token);
    }

    static isTokenExpired(token)
    {
        try{
            const decoded = decode(token);
            if(decoded.exp < Date.now / 1000)
                return true;
            else return false; 
        }
        catch(err)
        {
            return false;
        }
    }
    static getLogin()
    {
        var user = store.getState().userApp.user;
        return  user ? user.username : "";
    }

    static setUser(user)
    {
        store.dispatch(userLogin(user));
    }

    static setToken(token)
    {
        localStorage.setItem("token", token);
        AuthService.updateAuthHeader();
    }

    static getToken()
    {
        return localStorage.getItem("token");
    }

    static updateAuthHeader() {
        axios.defaults.headers.common['Authorization'] =  AuthService.loggedIn() ? 'Bearer ' + this.getToken() : "";
        axios.defaults.headers.common['Content-Type'] =  "application/json";
        axios.defaults.headers.common['Accept'] =  "application/json";
        axios.defaults.headers.common['Access-Control-Allow-Origin'] =  "http://localhost:3000";
    }

    static logout() {
        localStorage.removeItem('token');
        store.dispatch(userLogout());
        AuthService.updateAuthHeader();
    }
}