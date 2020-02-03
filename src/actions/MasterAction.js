import { NotificationManager } from "react-notifications";
import {
  FETCH_START_BRANCH,
  FETCH_END_BRANCH,
  FETCH_ERROR_BRANCH,
  FETCH_START_ROLE,
  FETCH_ERROR_ROLE,
  FETCH_END_ROLE,
  FETCH_START_VENDOR_MASTER,
  FETCH_END_VENDOR_MASTER,
  FETCH_ERROR_VENDOR_MASTER
} from "Actions/types";
import { RESPONSE_SUCCESS, RESPONSE_NETWORKERROR } from "../actions/response";
import { STORAGE_USERMODELS, STORAGE_TOKEN } from "../store/storages";
import { NOTIFY_NETWORKERROR } from "../notifications/notifications";
import AppConfig from "../constants/AppConfig";
import axios from "axios";

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

export const fetchingDataBranch = branchP => async dispatch => {
  dispatch({ type: FETCH_START_BRANCH });
  await axios
    .get(AppConfig.serviceUrl + "branch/read/Get?idP=" + branchP, {
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

        // NotificationManager.success(
        //   "Fetching Data successful!",
        //   null,
        //   1000
        // );
      }
    })
    .catch(error => catchError(error, dispatch, FETCH_ERROR_BRANCH));
};

export const fetchingDataRole = () => async dispatch => {
  dispatch({ type: FETCH_START_ROLE });
  await axios
    .get(AppConfig.serviceUrl + "role/read/Get?idP=" + "0", {
      headers: {
        "content-type": "application/json; charset=utf-8",
        Authorization: "bearer " + localStorage.getItem(STORAGE_TOKEN)
      }
    })
    .then(response => {
      // check response
      if (response.data.description !== RESPONSE_SUCCESS) {
        dispatch({ type: FETCH_ERROR_ROLE });
        NotificationManager.error(response.data.data);
      } else {
        dispatch({
          type: FETCH_END_ROLE,
          payload: response.data.data
        });
      }
    })
    .catch(error => catchError(error, dispatch, FETCH_ERROR_ROLE));
};


export const fetchingDataVendor = () => async dispatch => {
  dispatch({ type: FETCH_START_VENDOR_MASTER });
  await axios
    .get(AppConfig.serviceUrl + "vendor/read/Get?idP=" + "0", {
      headers: {
        "content-type": "application/json; charset=utf-8",
        Authorization: "bearer " + localStorage.getItem(STORAGE_TOKEN)
      }
    })
    .then(response => {
      // check response
      if (response.data.description !== RESPONSE_SUCCESS) {
        dispatch({ type: FETCH_ERROR_VENDOR_MASTER });
        NotificationManager.error(response.data.data);
      } else {
        dispatch({
          type: FETCH_END_VENDOR_MASTER,
          payload: response.data.data
        });
      }
    })
    .catch(error => catchError(error, dispatch, FETCH_ERROR_VENDOR_MASTER));
};