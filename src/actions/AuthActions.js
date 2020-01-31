/**
 * Auth Actions
 * Auth Action With Google, Facebook, Twitter and Github
 */
import firebase from "firebase/app";
import "firebase/auth";

import { NotificationManager } from "react-notifications";
import {
  ACTIVESESSION_START,
  ACTIVESESSION_END,
  ACTIVESESSION_ERROR,
  GETIP_START,
  GETIP_END,
  GETIP_ERROR,
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILURE,
  LOGOUT_USER,
  SIGNUP_USER,
  SIGNUP_USER_SUCCESS,
  SIGNUP_USER_FAILURE,
  FETCH_START_BRANCH,
  FETCH_END_BRANCH,
  FETCH_ERROR_BRANCH,
  FETCH_START_PAYMENTTYPE,
  FETCH_END_PAYMENTTYPE,
  FETCH_ERROR_PAYMENTTYPE
} from "Actions/types";
import { RESPONSE_SUCCESS, RESPONSE_NETWORKERROR } from "../actions/response";
import {
  STORAGE_USERMODELS,
  STORAGE_TOKEN,
  STORAGE_BRANCH,
  STORAGE_PAYMENTTYPE,
  STORAGE_SESSION
} from "../store/storages";
import { NOTIFY_NETWORKERROR } from "../notifications/notifications";
import AppConfig from "../constants/AppConfig";
import axios from "axios";
import { encryptData, decryptData } from "../helpers/helpers";
const querystring = require("querystring");

export const clearUser = () => async dispatch => {
  localStorage.removeItem(STORAGE_USERMODELS);
  dispatch({ type: LOGIN_USER_SUCCESS, payload: null });
};

export const activeSession = (userP, TokenP) => async dispatch => {
  dispatch({ type: ACTIVESESSION_START });
  await axios
    .post(
      AppConfig.serviceUrl + "api/accounts/activesession/",
      {
        User_Name: userP,
        Token: TokenP
      },
      {
        headers: {
          "content-type": "application/json; charset=utf-8",
          Authorization: "bearer " + localStorage.getItem(STORAGE_TOKEN)
        }
      }
    )
    .then(response => {
      if (response.data.description !== RESPONSE_SUCCESS) {
        dispatch({ type: ACTIVESESSION_ERROR });
      } else {
        dispatch({
          type: ACTIVESESSION_END,
          payload: response.data
        });
        localStorage.setItem(
          STORAGE_SESSION,
          encryptData(JSON.stringify(response.data))
        );
      }
    })
    .catch(error => catchError(error, dispatch, ACTIVESESSION_ERROR));
};

/**
 * Redux Action To Sigin User With Business central (navision)
 */
export const signinUserInBC = (user, history) => async dispatch => {
  const { email, password } = user;
  let countrycodeL = "";
  let countrynameL = "";
  let latitudeL = "";
  let longitudeL = "";
  let ipv4L = "";

  dispatch({ type: GETIP_START });
  await axios
    .get("https://geoip-db.com/json/", {
      headers: { "content-type": "application/json; charset=utf-8" }
    })
    .then(response => {
      countrycodeL = response.data.country_code;
      countrynameL = response.data.country_name;
      latitudeL = response.data.latitude;
      longitudeL = response.data.longitude;
      ipv4L = response.data.IPv4;
      dispatch({ type: GETIP_END });
    })
    .catch(error => catchError(error, dispatch, GETIP_ERROR));

  dispatch({ type: LOGIN_USER });
  await axios
    .post(
      AppConfig.serviceUrl + "token",
      querystring.stringify({
        username: AppConfig.usernameJWT, //gave the values directly for testing
        password: AppConfig.passwordJWT,
        grant_type: AppConfig.grantType
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    )
    .then(response => {
      localStorage.setItem(STORAGE_TOKEN, response.data.access_token);
    })
    .catch(error => catchError(error, dispatch, LOGIN_USER_FAILURE));

  await axios
    .post(
      AppConfig.serviceUrl + "api/accounts/signin",
      {
        IPv4: ipv4L,
        Country_Code: countrycodeL,
        Country_Name: countrynameL,
        Latitude: latitudeL,
        Longitude: longitudeL,
        User_Name: email,
        Password: password,
        Token: localStorage.getItem(STORAGE_TOKEN)
      },
      { headers: { "content-type": "application/json; charset=utf-8" } }
    )
    .then(response => {
      if (response.data.description !== RESPONSE_SUCCESS) {
        dispatch({ type: LOGIN_USER_FAILURE });
        localStorage.clear();
        NotificationManager.error(response.data.data);
      } else {
        localStorage.setItem("user_id", "user-id");
        localStorage.setItem(
          STORAGE_USERMODELS,
          encryptData(JSON.stringify(response.data.data))
        );
        dispatch({
          type: LOGIN_USER_SUCCESS,
          payload: localStorage.getItem(STORAGE_USERMODELS)
        });
      }
    })
    .catch(error => catchError(error, dispatch, LOGIN_USER_FAILURE));

  dispatch({ type: FETCH_START_PAYMENTTYPE });
  await axios
    .get(AppConfig.serviceUrl + "product/read/Get?idP=" + "0", {
      headers: {
        "content-type": "application/json; charset=utf-8",
        Authorization: "bearer " + localStorage.getItem(STORAGE_TOKEN)
      }
    })
    .then(response => {
      // check response
      if (response.data.description !== RESPONSE_SUCCESS) {
        dispatch({ type: FETCH_ERROR_PAYMENTTYPE });
        NotificationManager.error(response.data.data);
      } else {
        dispatch({
          type: FETCH_END_PAYMENTTYPE,
          payload: response.data.data
        });
        localStorage.setItem(
          STORAGE_PAYMENTTYPE,
          encryptData(JSON.stringify(response.data.data))
        );
      }
    })
    .catch(error => catchError(error, dispatch, FETCH_ERROR_PAYMENTTYPE));

  dispatch({ type: FETCH_START_BRANCH });
  await axios
    .get(AppConfig.serviceUrl + "branch/read/Get?idP=" + "0", {
      headers: {
        "content-type": "application/json; charset=utf-8",
        Authorization: "bearer " + localStorage.getItem(STORAGE_TOKEN)
      }
    })
    .then(response => {
      // check response
      if (response.data.description !== RESPONSE_SUCCESS) {
        dispatch({ type: FETCH_ERROR_BRANCH });
        NotificationManager.error(response.data.data);
      } else {
        dispatch({
          type: FETCH_END_BRANCH,
          payload: response.data.data
        });
        localStorage.setItem(
          STORAGE_BRANCH,
          encryptData(JSON.stringify(response.data.data))
        );

        // after finished login //
        NotificationManager.success("User Login Successfully!", null, 1000);

        setTimeout(() => {
          history.push("/app/expense/expense-management-list");
        }, 1000);
        // after finished login //
      }
    })
    .catch(error => catchError(error, dispatch, FETCH_ERROR_BRANCH));
};

const catchError = (error, dispatch, type) => {
  if (dispatch !== null) {
    dispatch({ type: type });
  }

  if (!error.response) {
    NotificationManager.error(NOTIFY_NETWORKERROR);
  }
  if (error.response.status === 400) {
    NotificationManager.error(NOTIFY_NETWORKERROR);
  }
  return Promise.reject(error);
};

/**
 * Redux Action To Sigin User With Firebase
 */
export const signinUserInFirebase = (user, history) => dispatch => {
  console.log("action");
  //   dispatch({ type: LOGIN_USER });
  //   firebase
  //     .auth()
  //     .signInWithEmailAndPassword(user.email, user.password)
  //     .then(user => {
  //       localStorage.setItem("user_id", "user-id");
  //       dispatch({
  //         type: LOGIN_USER_SUCCESS,
  //         payload: localStorage.getItem("user_id")
  //       });
  //       history.push("/");
  //       NotificationManager.success("User Login Successfully!");
  //     })
  //     .catch(error => {
  //       dispatch({ type: LOGIN_USER_FAILURE });
  //       NotificationManager.error(error.message);
  //     });
};

/**
 * Redux Action To Signout User From  Firebase
 */
export const logoutUserFromFirebase = () => async dispatch => {
  let userL = JSON.parse(decryptData(localStorage.getItem(STORAGE_USERMODELS)));
  let tokenL = await localStorage.getItem(STORAGE_TOKEN);

  let countrycodeL = "";
  let countrynameL = "";
  let latitudeL = "";
  let longitudeL = "";
  let ipv4L = "";

  dispatch({ type: GETIP_START });
  await axios
    .get("https://geoip-db.com/json/", {
      headers: { "content-type": "application/json; charset=utf-8" }
    })
    .then(response => {
      countrycodeL = response.data.country_code;
      countrynameL = response.data.country_name;
      latitudeL = response.data.latitude;
      longitudeL = response.data.longitude;
      ipv4L = response.data.IPv4;
      dispatch({ type: GETIP_END });
    })
    .catch(error => catchError(error, dispatch, GETIP_ERROR));

  await axios
    .post(
      AppConfig.serviceUrl + "api/accounts/signout",
      {
        IPv4: ipv4L,
        Country_Code: countrycodeL,
        Country_Name: countrynameL,
        Latitude: latitudeL,
        Longitude: longitudeL,
        User_Name: userL.user_Name,
        Token: tokenL
      },
      { headers: { "content-type": "application/json; charset=utf-8" } }
    )
    .then(response => {
      if (response.data.description !== RESPONSE_SUCCESS) {
        dispatch({ type: LOGIN_USER_FAILURE });
        localStorage.clear();
        NotificationManager.error(response.data.data);
      } else {
        localStorage.clear();
        NotificationManager.success("User Logout Successfully", null, 1000);
      }
    })
    .catch(error => catchError(error, dispatch, LOGIN_USER_FAILURE));
  dispatch({ type: LOGOUT_USER });
};

/**
 * Redux Action To Signup User In Firebase
 */
export const signupUserInFirebase = (user, history) => dispatch => {
  dispatch({ type: SIGNUP_USER });
  firebase
    .auth()
    .createUserWithEmailAndPassword(user.email, user.password)
    .then(success => {
      localStorage.setItem("user_id", "user-id");
      dispatch({
        type: SIGNUP_USER_SUCCESS,
        payload: localStorage.getItem("user_id")
      });
      history.push("/");
      NotificationManager.success("Account Created Successfully!");
    })
    .catch(error => {
      dispatch({ type: SIGNUP_USER_FAILURE });
      NotificationManager.error(error.message);
    });
};

/**
 * Redux Action To Signin User In Firebase With Facebook
 */
export const signinUserWithFacebook = history => dispatch => {
  dispatch({ type: LOGIN_USER });
  const provider = new firebase.auth.FacebookAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function(result) {
      localStorage.setItem("user_id", "user-id");
      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: localStorage.getItem("user_id")
      });
      history.push("/");
      NotificationManager.success(`Hi ${result.user.displayName}!`);
    })
    .catch(function(error) {
      dispatch({ type: LOGIN_USER_FAILURE });
      NotificationManager.error(error.message);
    });
};

/**
 * Redux Action To Signin User In Firebase With Google
 */
export const signinUserWithGoogle = history => dispatch => {
  dispatch({ type: LOGIN_USER });
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function(result) {
      localStorage.setItem("user_id", "user-id");
      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: localStorage.getItem("user_id")
      });
      history.push("/");
      NotificationManager.success(`Hi ${result.user.displayName}!`);
    })
    .catch(function(error) {
      dispatch({ type: LOGIN_USER_FAILURE });
      NotificationManager.error(error.message);
    });
};

/**
 * Redux Action To Signin User In Firebase With Github
 */
export const signinUserWithGithub = history => dispatch => {
  dispatch({ type: LOGIN_USER });
  const provider = new firebase.auth.GithubAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function(result) {
      localStorage.setItem("user_id", "user-id");
      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: localStorage.getItem("user_id")
      });
      history.push("/");
      NotificationManager.success(`Hi ${result.user.displayName}!`);
    })
    .catch(function(error) {
      dispatch({ type: LOGIN_USER_FAILURE });
      NotificationManager.error(error.message);
    });
};

/**
 * Redux Action To Signin User In Firebase With Twitter
 */
export const signinUserWithTwitter = history => dispatch => {
  //   dispatch({ type: LOGIN_USER });
  //   const provider = new firebase.auth.TwitterAuthProvider();
  //   firebase
  //     .auth()
  //     .signInWithPopup(provider)
  //     .then(function(result) {
  //       localStorage.setItem("user_id", "user-id");
  //       dispatch({
  //         type: LOGIN_USER_SUCCESS,
  //         payload: localStorage.getItem("user_id")
  //       });
  //       history.push("/");
  //       NotificationManager.success("User Login Successfully!");
  //     })
  //     .catch(function(error) {
  //       dispatch({ type: LOGIN_USER_FAILURE });
  //       NotificationManager.error(error.message);
  //     });
};
