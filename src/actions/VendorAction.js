import { NotificationManager } from "react-notifications";
import {
  FETCH_START_VENDOR,
  FETCH_END_VENDOR,
  FETCH_ERROR_VENDOR,
  DEL_START_VENDOR,
  DEL_END_VENDOR,
  DEL_ERROR_VENDOR,
  UPDATE_START_VENDOR,
  UPDATE_END_VENDOR,
  UPDATE_ERROR_VENDOR,
  ADD_START_VENDOR,
  ADD_END_VENDOR,
  ADD_ERROR_VENDOR
} from "Actions/types";
import { RESPONSE_SUCCESS, RESPONSE_NETWORKERROR } from "../actions/response";
import {
  STORAGE_USERMODELS,
  STORAGE_TOKEN,
  STORAGE_BRANCH,
  STORAGE_ROLE,
  STORAGE_PAYMENTTYPE,
  STORAGE_SESSION
} from "../store/storages";
import { NOTIFY_NETWORKERROR } from "../notifications/notifications";
import AppConfig from "../constants/AppConfig";
import axios from "axios";
import { encryptData } from "../helpers/helpers";

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
  if (error.response.status === 401) {
    NotificationManager.error(UNAUTHORIZED_NETWORKERROR);
  }
  return Promise.reject(error);
};

export const fetchingDataVendor = idP => async dispatch => {
  dispatch({ type: FETCH_START_VENDOR });
  await axios
    .get(AppConfig.serviceUrl + "vendor/read/Get?idP=" + idP, {
      headers: {
        "content-type": "application/json; charset=utf-8",
        Authorization: "bearer " + localStorage.getItem(STORAGE_TOKEN)
      }
    })
    .then(response => {
      // check response
      if (
        response.data.description === RESPONSE_ERROR ||
        response.data.description === RESPONSE_NETWORKERROR
      ) {
        dispatch({ type: FETCH_ERROR_VENDOR });
        NotificationManager.error(response.data.data);
      } else {
        if (response.data.description === RESPONSE_NULL) {
          dispatch({
            type: FETCH_END_VENDOR,
            payload: null
          });
        } else {
          dispatch({
            type: FETCH_END_VENDOR,
            payload: response.data.data
          });
        }
      }
    })
    .catch(error => catchError(error, dispatch, FETCH_ERROR_VENDOR));
};

export const deleteDataVendor = dataP => async dispatch => {
  const userL =
    localStorage.getItem(STORAGE_USERMODELS) === null
      ? null
      : JSON.parse(decryptData(localStorage.getItem(STORAGE_USERMODELS)));

  dispatch({ type: DEL_START_VENDOR });
  await axios
    .post(
      AppConfig.serviceUrl + "vendor/delete",
      {
        KeyLists: dataP,
        UpdateBy: userL.user_Name
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
        dispatch({ type: DEL_ERROR_VENDOR });
        NotificationManager.error(response.data.data);
      } else {
        dispatch({ type: DEL_END_VENDOR });
        NotificationManager.success(response.data.data);
      }
    })
    .catch(error => catchError(error, dispatch, DEL_ERROR_VENDOR));
};

export const updateDataVendor = (dataP, branchP) => async dispatch => {
  const userL =
    localStorage.getItem(STORAGE_USERMODELS) === null
      ? null
      : JSON.parse(decryptData(localStorage.getItem(STORAGE_USERMODELS)));

  dispatch({ type: UPDATE_START_VENDOR });
  await axios
    .post(
      AppConfig.serviceUrl + "vendor/update",
      {
        Fk_Branch: branchP,
        Id: dataP.Id,
        Invoice_No: dataP.Invoice_No,
        Total: dataP.Total,
        Description: dataP.Description,
        CreateBy: convertDateToWebservice(dataP.CreateDate), // ** borrow variable to send date type string //
        UpdateBy: userL.user_Name
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
        dispatch({ type: UPDATE_ERROR_VENDOR });
        NotificationManager.error(response.data.data);
      } else {
        dispatch({ type: UPDATE_END_VENDOR });
        NotificationManager.success(response.data.data);
      }
    })
    .catch(error => catchError(error, dispatch, UPDATE_ERROR_VENDOR));
};

export const searchDateVendor = date => dispatch => {
  dispatch({ type: SEARCH_DATE_VENDOR, payload: date });
};

export const addDataVendor = dataP => async dispatch => {
  const userL =
    localStorage.getItem(STORAGE_USERMODELS) === null
      ? null
      : JSON.parse(decryptData(localStorage.getItem(STORAGE_USERMODELS)));

  dispatch({ type: ADD_START_VENDOR });
  await axios
    .post(
      AppConfig.serviceUrl + "vendor/insert",
      {
        Name: dataP.Name,
        Description: dataP.Description,
        CreateBy: userL.user_Name, // ** borrow variable to send date type string //
        UpdateBy: userL.user_Name
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
        dispatch({ type: ADD_ERROR_VENDOR });
        NotificationManager.error(response.data.data);
      } else {
        dispatch({ type: ADD_END_VENDOR });
        NotificationManager.success(response.data.data);
      }
    })
    .catch(error => catchError(error, dispatch, ADD_ERROR_VENDOR));
};
