import { AUTH_SUCCESS, AUTH_LOGOUT } from "./actionTypes";
import axios from "axios";
export function auth(email, password, isLogin) {
  return async (dispatch) => {
    const loginUrl =
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCRZ8pqovqtGWhLzp8t0FXGZjJ8SWoIN2M";
    const registerUrl =
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCRZ8pqovqtGWhLzp8t0FXGZjJ8SWoIN2M";
    const url = isLogin ? loginUrl : registerUrl;
    const response = await axios.post(url, {
      email,
      password,
      returnSecureToken: true,
    });
    const data = response.data;
    const expirationDate = new Date(
      new Date().getTime() + data.expiresIn * 1000
    );
    localStorage.tokenReact = data.idToken;
    localStorage.userIdReact = data.localId;
    localStorage.expirationDate = expirationDate;
    dispatch(authSuccess(data.idToken));

  };
}

export function autoLogout(time) {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, time * 1000);
  };
}
export function autoLogin() {
  return dispatch => {
    const expirationDate = new Date(localStorage.expirationDate)
    if (!localStorage.token || expirationDate <= new Date()) {
      dispatch.logout()
    } else {
      dispatch(authSuccess(localStorage.token))
      dispatch(autoLogout((expirationDate.getTime() - new Date().getTime()) / 1000))
    }
  }
}
export function logout() {
  delete localStorage.tokenReact;
  delete localStorage.userIdReact;
  delete localStorage.expirationDate;
  return {
    type: AUTH_LOGOUT,
  };
}

export function authSuccess(token) {
  return {
    type: AUTH_SUCCESS,
    token,
  };
}
