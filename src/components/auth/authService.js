import axios from "axios";
import decode from "jwt-decode";
import Conf from "../../configuration";
import { store } from "../../store";
import { userLogin, userLogout } from "../profile/userActions";
import { showError } from "../common/helperFunctions";

export default class AuthService {
  static register(email, username, password, firstName, lastName) {
    return axios
      .post(`${Conf.domain}api/register`, {
        email,
        username,
        password,
        firstName,
        lastName
      })
      .then(res => {
        AuthService.setToken(res.data.token);
        AuthService.setUser(res.data.user);
      })
      .catch(res => {
        throw AuthService.handleException(res);
      });
  }

  static login(email, password) {
    return axios
      .post(`${Conf.domain}api/login`, {
        email,
        password
      })
      .then(res => {
        AuthService.setToken(res.data.token);
        AuthService.setUser(res.data.user);
      })
      .catch(res => {
        throw AuthService.handleException(res);
      });
  }

  static uploadFile(url, formData, config) {
    AuthService.updateAuthHeader();
    axios.post(Conf.domain + url, formData, config);
  }

  static getUserInfo() {
    const url = "api/user";

    AuthService.get(url)
      .then(res => AuthService.setUser(res.data))
      .catch(res => showError(AuthService.handleException(res)));
  }

  static handleException(res) {
    var errors = [];
    if (res.response !== undefined) {
      if (res.response.status === 401) {
        return;
      }
      if (res.response.data.message !== undefined) {
        errors.push(res.response.data.message);
      } else
        for (var key in { ...res.response.data }) {
          errors = errors.concat(res.response.data[key]);
        }
    }
    if (errors.length === 0) errors.push("Network error");

    return errors;
  }

  static delete(url, id) {
    this.updateAuthHeader();
    return axios.delete(`${Conf.domain + url}/${id}`);
  }

  static post(url, data, config) {
    this.updateAuthHeader();
    return axios.post(Conf.domain + url, data, config);
  }

  static get(url, params) {
    this.updateAuthHeader();
    return axios.get(Conf.domain + url, { params });
  }

  static put(url, id, data, config) {
    this.updateAuthHeader();
    return id
      ? axios.put(`${Conf.domain + url}/${id}`, data, config)
      : axios.put(Conf.domain + url, data, config);
  }

  static loggedIn() {
    const token = AuthService.getToken();
    return !!token && !AuthService.isTokenExpired(token);
  }

  static isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now / 1000) return true;
      return false;
    } catch (err) {
      return false;
    }
  }

  static getLogin() {
    const { user } = store.getState().userApp;
    return user ? user.username : "";
  }

  static setUser(user) {
    store.dispatch(userLogin(user));
    localStorage.setItem("user", JSON.stringify(user));
  }

  static setToken(token) {
    localStorage.setItem("token", token);
    AuthService.updateAuthHeader();
  }

  static getToken() {
    return localStorage.getItem("token");
  }

  static updateAuthHeader() {
    axios.defaults.headers.common.Authorization = AuthService.loggedIn()
      ? `Bearer ${this.getToken()}`
      : "";
  }

  static logout() {
    localStorage.removeItem("token");
    store.dispatch(userLogout());
    AuthService.updateAuthHeader();
  }
}
