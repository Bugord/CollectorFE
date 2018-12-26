import axios from "axios";
import decode from "jwt-decode";
import Conf from "../../configuration";
import { store } from "../../store";
import { userLogin, userLogout } from "../profile/userActions";

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

  static uploadFile(selectedFile) {
    const formData = new FormData();
    formData.append("file", selectedFile, selectedFile.name);

    AuthService.updateAuthHeader();
    axios.post("https://localhost:5001/api/UploadFiles", formData);
  }

  static addFriend(name) {
    this.updateAuthHeader();

    axios
      .post(`${Conf.domain}api/addFriend`, {
        name
      })
      .then(() => {})
      .catch(() => {});
  }

  static getUserInfo() {
    axios.get(`${Conf.domain}api/user`).then(res => {
      AuthService.setUser(res.data);
    });
  }

  static handleException(res) {
    var errors = [];
    if (res.response != undefined) {
      if (res.response.status === 401) {
        AuthService.logout();
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

  static post(url, data) {
    this.updateAuthHeader();
    return axios.post(Conf.domain + url, data);
  }

  static get(url, params) {
    this.updateAuthHeader();
    return axios.get(Conf.domain + url, { params });
  }

  static put(url, id, data) {
    this.updateAuthHeader();
    return axios.put(`${Conf.domain + url}/${id}`, data);
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
