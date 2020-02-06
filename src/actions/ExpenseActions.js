import { NotificationManager } from "react-notifications";
import {
  FETCH_START_EXPENSE,
  FETCH_END_EXPENSE,
  FETCH_ERROR_EXPENSE,
  UPDATE_START_EXPENSE,
  UPDATE_END_EXPENSE,
  UPDATE_ERROR_EXPENSE,
  ADD_START_EXPENSE,
  ADD_END_EXPENSE,
  ADD_ERROR_EXPENSE,
  DEL_START_EXPENSE,
  DEL_END_EXPENSE,
  DEL_ERROR_EXPENSE,
  SEND_START_EXPENSE,
  SEND_END_EXPENSE,
  SEND_ERROR_EXPENSE,
  VALIDATE_START_EXPENSE,
  VALIDATE_END_EXPENSE,
  VALIDATE_ERROR_EXPENSE,
  ERROR_UNAUTHORIZED_EXPENSE,
  ERROR_NETWORK_EXPENSE,
  ERROR_OTHER_EXPENSE
} from "Actions/types";
import {
  RESPONSE_SUCCESS,
  RESPONSE_ERROR,
  RESPONSE_NETWORKERROR,
  RESPONSE_NULL
} from "../actions/response";
import { STORAGE_USERMODELS, STORAGE_TOKEN } from "../store/storages";
import {
  NOTIFY_NETWORKERROR,
  UNAUTHORIZED_NETWORKERROR
} from "../notifications/notifications";
import AppConfig from "../constants/AppConfig";
import axios from "axios";
import { decryptData, convertDateToWebservice } from "../helpers/helpers";

const catchError = (error, dispatch, type) => {
  if (dispatch !== null) {
    dispatch({ type: type });
  }

  if (!error.response) {
    dispatch({ type: ERROR_OTHER_EXPENSE, payload: true });
  }
  if (error.response.status === 400) {
    dispatch({ type: ERROR_NETWORK_EXPENSE, payload: true });
  }
  if (error.response.status === 401) {
    dispatch({ type: ERROR_UNAUTHORIZED_EXPENSE, payload: true });
  }
  return Promise.reject(error);
};

export const fetchingDataExpense = branchP => async dispatch => {
  dispatch({ type: FETCH_START_EXPENSE });
  await axios
    .get(AppConfig.serviceUrl + "expense/read/Get?branchP=" + branchP, {
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
        dispatch({ type: FETCH_ERROR_EXPENSE });
        NotificationManager.error(response.data.data);
      } else {
        if (response.data.description === RESPONSE_NULL) {
          dispatch({
            type: FETCH_END_EXPENSE,
            payload: null
          });
        } else {
          dispatch({
            type: FETCH_END_EXPENSE,
            payload: response.data.data
          });
        }
      }
    })
    .catch(error => catchError(error, dispatch, FETCH_ERROR_EXPENSE));
};

export const deleteDataExpense = dataP => async dispatch => {
  const userL =
    localStorage.getItem(STORAGE_USERMODELS) === null
      ? null
      : JSON.parse(decryptData(localStorage.getItem(STORAGE_USERMODELS)));

  dispatch({ type: DEL_START_EXPENSE });
  await axios
    .post(
      AppConfig.serviceUrl + "expense/delete",
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
        dispatch({ type: DEL_ERROR_EXPENSE });
        NotificationManager.error(response.data.data);
      } else {
        dispatch({ type: DEL_END_EXPENSE });
        NotificationManager.success(response.data.data);
      }
    })
    .catch(error => catchError(error, dispatch, DEL_ERROR_EXPENSE));
};

export const sendDataExpense = dataP => async dispatch => {
  const userL =
    localStorage.getItem(STORAGE_USERMODELS) === null
      ? null
      : JSON.parse(decryptData(localStorage.getItem(STORAGE_USERMODELS)));

  dispatch({ type: SEND_START_EXPENSE });
  await axios
    .post(
      AppConfig.serviceUrl + "expense/send",
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
        dispatch({ type: SEND_ERROR_EXPENSE });
        NotificationManager.error(response.data.data);
      } else {
        dispatch({ type: SEND_END_EXPENSE });
        NotificationManager.success(response.data.data);
      }
    })
    .catch(error => catchError(error, dispatch, SEND_ERROR_EXPENSE));
};

export const updateDataExpense = (dataP, branchP) => async dispatch => {
  const userL =
    localStorage.getItem(STORAGE_USERMODELS) === null
      ? null
      : JSON.parse(decryptData(localStorage.getItem(STORAGE_USERMODELS)));

  dispatch({ type: UPDATE_START_EXPENSE });
  await axios
    .post(
      AppConfig.serviceUrl + "expense/update",
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
        dispatch({ type: UPDATE_ERROR_EXPENSE });
        NotificationManager.error(response.data.data);
      } else {
        dispatch({ type: UPDATE_END_EXPENSE });
        NotificationManager.success(response.data.data);
      }
    })
    .catch(error => catchError(error, dispatch, UPDATE_ERROR_EXPENSE));
};

export const searchDateExpense = date => dispatch => {
  dispatch({ type: SEARCH_DATE_EXPENSE, payload: date });
};

export const addDataExpense = (dataP, branchP) => async dispatch => {
  const userL =
    localStorage.getItem(STORAGE_USERMODELS) === null
      ? null
      : JSON.parse(decryptData(localStorage.getItem(STORAGE_USERMODELS)));

  dispatch({ type: ADD_START_EXPENSE });
  await axios
    .post(
      AppConfig.serviceUrl + "expense/insert",
      {
        Fk_Branch: branchP,
        Image: "", // not yet specify
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
        dispatch({ type: ADD_ERROR_EXPENSE });
        NotificationManager.error(response.data.data);
      } else {
        dispatch({ type: ADD_END_EXPENSE });
        NotificationManager.success(response.data.data);
      }
    })
    .catch(error => catchError(error, dispatch, ADD_ERROR_EXPENSE));
};

export const validateDataExpense = dataP => async dispatch => {
  dispatch({ type: VALIDATE_START_EXPENSE });
  await axios
    .post(
      AppConfig.serviceUrl + "expense/validate",
      {
        Invoice_No: dataP.Invoice_No
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
        dispatch({ type: VALIDATE_ERROR_EXPENSE });
      } else {
        dispatch({ type: VALIDATE_END_EXPENSE });
      }
    })
    .catch(error => catchError(error, dispatch, VALIDATE_ERROR_EXPENSE));
};
