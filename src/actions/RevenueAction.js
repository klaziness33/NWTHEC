import { NotificationManager } from "react-notifications";
import {
  FETCH_START_REVENUE,
  FETCH_END_REVENUE,
  FETCH_ERROR_REVENUE,
  UPDATE_START_REVENUE,
  UPDATE_END_REVENUE,
  UPDATE_ERROR_REVENUE,
  ADD_START_REVENUE,
  ADD_END_REVENUE,
  ADD_ERROR_REVENUE,
  DEL_START_REVENUE,
  DEL_END_REVENUE,
  DEL_ERROR_REVENUE,
  SEND_START_REVENUE,
  SEND_END_REVENUE,
  SEND_ERROR_REVENUE
} from "Actions/types";
import {
  RESPONSE_SUCCESS,
  RESPONSE_ERROR,
  RESPONSE_NETWORKERROR,
  RESPONSE_NULL
} from "../actions/response";
import { STORAGE_USERMODELS, STORAGE_TOKEN } from "../store/storages";
import { NOTIFY_NETWORKERROR } from "../notifications/notifications";
import AppConfig from "../constants/AppConfig";
import axios from "axios";
import {
  decryptData,
  convertDateToWebservice,
  parseDateString,
  parseDateInt
} from "../helpers/helpers";

const moment = require("moment");

export const sendRevenue = dataP => async dispatch => {
  let dataObjL = {
    BillDate: convertDateToWebservice(dataP.BillDate),
    FK_Branch: dataP.FK_Branch,
    petrol_attach: dataP.petrol_attach,
    petrol_b20diesal_total: dataP.petrol_b20diesal_total,
    petrol_b20diesal_quantity: dataP.petrol_b20diesal_quantity,
    petrol_b20diesal_price: dataP.petrol_b20diesal_price,
    petrol_b20diesal_paymentType: dataP.petrol_b20diesal_paymentType,
    petrol_e20gsh_total: dataP.petrol_e20gsh_total,
    petrol_e20gsh_quantity: dataP.petrol_e20gsh_quantity,
    petrol_e20gsh_price: dataP.petrol_e20gsh_price,
    petrol_e20gsh_paymentType: dataP.petrol_e20gsh_paymentType,
    petrol_fsdiesal_total: dataP.petrol_fsdiesal_total,
    petrol_fsdiesal_quantity: dataP.petrol_fsdiesal_quantity,
    petrol_fsdiesal_price: dataP.petrol_fsdiesal_price,
    petrol_fsdiesal_paymentType: dataP.petrol_fsdiesal_paymentType,
    petrol_fsgsh91_total: dataP.petrol_fsgsh91_total,
    petrol_fsgsh91_quantity: dataP.petrol_fsgsh91_quantity,
    petrol_fsgsh91_price: dataP.petrol_fsgsh91_price,
    petrol_fsgsh91_paymentType: dataP.petrol_fsgsh91_paymentType,
    petrol_vpdiesal_total: dataP.petrol_vpdiesal_total,
    petrol_vpdiesal_quantity: dataP.petrol_vpdiesal_quantity,
    petrol_vpdiesal_price: dataP.petrol_vpdiesal_price,
    petrol_vpdiesal_paymentType: dataP.petrol_vpdiesal_paymentType,
    petrol_vpgsh95_total: dataP.petrol_vpgsh95_total,
    petrol_vpgsh95_quantity: dataP.petrol_vpgsh95_quantity,
    petrol_vpgsh95_price: dataP.petrol_vpgsh95_price,
    petrol_vpgsh95_paymentType: dataP.petrol_vpgsh95_paymentType,
    engineoil_attach: dataP.engineoil_attach,
    engineoil_b20diesal_total: dataP.engineoil_b20diesal_total,
    engineoil_b20diesal_price: dataP.engineoil_b20diesal_price,
    engineoil_e20gsh_total: dataP.engineoil_e20gsh_total,
    engineoil_e20gsh_price: dataP.engineoil_e20gsh_price,
    engineoil_fsdiesal_total: dataP.engineoil_fsdiesal_total,
    engineoil_fsdiesal_price: dataP.engineoil_fsdiesal_price,
    carcare_attach: dataP.carcare_attach,
    carcare_size_s_washcar_total: dataP.carcare_size_s_washcar_total,
    carcare_size_s_washcar_price: dataP.carcare_size_s_washcar_price,
    carcare_size_s_wax_total: dataP.carcare_size_s_wax_total,
    carcare_size_s_wax_price: dataP.carcare_size_s_wax_price,
    carcare_size_m_washcar_total: dataP.carcare_size_m_washcar_total,
    carcare_size_m_washcar_price: dataP.carcare_size_m_washcar_price,
    carcare_size_m_wax_total: dataP.carcare_size_m_wax_total,
    carcare_size_m_wax_price: dataP.carcare_size_m_wax_price,
    carcare_size_l_washcar_total: dataP.carcare_size_l_washcar_total,
    carcare_size_l_washcar_price: dataP.carcare_size_l_washcar_price,
    carcare_size_l_wax_total: dataP.carcare_size_l_wax_total,
    carcare_size_l_wax_price: dataP.carcare_size_l_wax_price,
    conveniencestore_attach: dataP.conveniencestore_attach,
    conveniencestore_food_total: dataP.conveniencestore_food_total,
    conveniencestore_food_price: dataP.conveniencestore_food_price,
    conveniencestore_nonfood_total: dataP.conveniencestore_nonfood_total,
    conveniencestore_nonfood_price: dataP.conveniencestore_nonfood_price,
    cafe_attach: dataP.cafe_attach,
    cafe_revenuecafe_total: dataP.cafe_revenuecafe_total,
    cafe_revenuecafe_price: dataP.cafe_revenuecafe_price
  };

  dispatch({ type: SEND_START_REVENUE });
  await axios
    .post(AppConfig.serviceUrl + "revenue/send", dataObjL, {
      headers: {
        "content-type": "application/json; charset=utf-8",
        Authorization: "bearer " + localStorage.getItem(STORAGE_TOKEN)
      }
    })
    .then(response => {
      if (response.data.description !== RESPONSE_SUCCESS) {
        dispatch({ type: LOGIN_USER_FAILURE });
        localStorage.clear();
        NotificationManager.error(response.data.data);
      } else {
        // TODO
        dispatch({
          type: SEND_START_REVENUE,
          payload: response.data.data
        });
      }
    })
    .catch(error => catchError(error, dispatch, SEND_ERROR_REVENUE));
};

export const fetchingDataRevenue = branchP => async dispatch => {
  dispatch({ type: FETCH_START_REVENUE });
  await axios
    .get(AppConfig.serviceUrl + "revenue/read/Get?branchP=" + branchP, {
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
        dispatch({ type: FETCH_ERROR_REVENUE });
        NotificationManager.error(response.data.data);
      } else {
        if (response.data.description === RESPONSE_NULL) {
          dispatch({
            type: FETCH_END_REVENUE,
            payload: null
          });
        } else {
          dispatch({
            type: FETCH_END_REVENUE,
            payload: response.data.data
          });
        }
      }
    })
    .catch(error => catchError(error, dispatch, FETCH_ERROR_REVENUE));
};

export const deleteDataRevenue = dataP => async dispatch => {
  const userL =
    localStorage.getItem(STORAGE_USERMODELS) === null
      ? null
      : JSON.parse(decryptData(localStorage.getItem(STORAGE_USERMODELS)));

  dispatch({ type: DEL_START_REVENUE });
  await axios
    .post(
      AppConfig.serviceUrl + "revenue/delete",
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
        dispatch({ type: DEL_ERROR_REVENUE });
        NotificationManager.error(response.data.data);
      } else {
        NotificationManager.success(response.data.data);
      }
    })
    .catch(error => catchError(error, dispatch, DEL_ERROR_REVENUE));
  dispatch({ type: DEL_END_REVENUE });
};

export const sendDataRevenue = dataP => async dispatch => {
  const userL =
    localStorage.getItem(STORAGE_USERMODELS) === null
      ? null
      : JSON.parse(decryptData(localStorage.getItem(STORAGE_USERMODELS)));

  dispatch({ type: SEND_START_REVENUE });
  await axios
    .post(
      AppConfig.serviceUrl + "revenue/send",
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
        dispatch({ type: SEND_ERROR_REVENUE });
        NotificationManager.error(response.data.data);
      } else {
        NotificationManager.success(response.data.data);
      }
    })
    .catch(error => catchError(error, dispatch, SEND_ERROR_REVENUE));
  dispatch({ type: SEND_END_REVENUE });
};

export const updateDataRevenue = (dataP) => async dispatch => {
  const userL =
    localStorage.getItem(STORAGE_USERMODELS) === null
      ? null
      : JSON.parse(decryptData(localStorage.getItem(STORAGE_USERMODELS)));

  dispatch({ type: UPDATE_START_REVENUE });
  await axios
    .post(
      AppConfig.serviceUrl + "revenue/update",
      {
        Id: dataP.Id,
        BillDate: moment(dataP.BillDate).format("DD/MM/YYYY"),
        FK_Branch: dataP.FK_Branch,
        CreateBy: userL.user_Name,
        petrol_attach: dataP.petrol_attach,
        petrol_b20diesal_total: dataP.petrol_b20diesal_total,
        petrol_b20diesal_quantity: dataP.petrol_b20diesal_quantity,
        petrol_b20diesal_price: dataP.petrol_b20diesal_price,
        petrol_b20diesal_paymentType: dataP.petrol_b20diesal_paymentType,

        petrol_e20gsh_total: dataP.petrol_e20gsh_total,
        petrol_e20gsh_quantity: dataP.petrol_e20gsh_quantity,
        petrol_e20gsh_price: dataP.petrol_e20gsh_price,
        petrol_e20gsh_paymentType: dataP.petrol_e20gsh_paymentType,

        petrol_fsdiesal_total: dataP.petrol_fsdiesal_total,
        petrol_fsdiesal_quantity: dataP.petrol_fsdiesal_quantity,
        petrol_fsdiesal_price: dataP.petrol_fsdiesal_price,
        petrol_fsdiesal_paymentType: dataP.petrol_fsdiesal_paymentType,

        petrol_fsgsh91_total: dataP.petrol_fsgsh91_total,
        petrol_fsgsh91_quantity: dataP.petrol_fsgsh91_quantity,
        petrol_fsgsh91_price: dataP.petrol_fsgsh91_price,
        petrol_fsgsh91_paymentType: dataP.petrol_fsgsh91_paymentType,

        petrol_vpdiesal_total: dataP.petrol_vpdiesal_total,
        petrol_vpdiesal_quantity: dataP.petrol_vpdiesal_quantity,
        petrol_vpdiesal_price: dataP.petrol_vpdiesal_price,
        petrol_vpdiesal_paymentType: dataP.petrol_vpdiesal_paymentType,

        petrol_vpgsh95_total: dataP.petrol_vpgsh95_total,
        petrol_vpgsh95_quantity: dataP.petrol_vpgsh95_quantity,
        petrol_vpgsh95_price: dataP.petrol_vpgsh95_price,
        petrol_vpgsh95_paymentType: dataP.petrol_vpgsh95_paymentType,

        engineoil_attach: dataP.engineoil_attach,
        engineoil_b20diesal_total: dataP.engineoil_b20diesal_total,
        engineoil_b20diesal_price: dataP.engineoil_b20diesal_price,

        engineoil_e20gsh_total: dataP.engineoil_e20gsh_total,
        engineoil_e20gsh_price: dataP.engineoil_e20gsh_price,

        engineoil_fsdiesal_total: dataP.engineoil_fsdiesal_total,
        engineoil_fsdiesal_price: dataP.engineoil_fsdiesal_price,

        carcare_attach: dataP.carcare_attach,
        carcare_size_s_washcar_total: dataP.carcare_size_s_washcar_total,
        carcare_size_s_washcar_price: dataP.carcare_size_s_washcar_price,
        carcare_size_s_wax_total: dataP.carcare_size_s_wax_total,
        carcare_size_s_wax_price: dataP.carcare_size_s_wax_price,

        carcare_size_m_washcar_total: dataP.carcare_size_m_washcar_total,
        carcare_size_m_washcar_price: dataP.carcare_size_m_washcar_price,
        carcare_size_m_wax_total: dataP.carcare_size_m_wax_total,
        carcare_size_m_wax_price: dataP.carcare_size_m_wax_price,

        carcare_size_l_washcar_total: dataP.carcare_size_l_washcar_total,
        carcare_size_l_washcar_price: dataP.carcare_size_l_washcar_price,
        carcare_size_l_wax_total: dataP.carcare_size_l_wax_total,
        carcare_size_l_wax_price: dataP.carcare_size_l_wax_price,

        conveniencestore_attach: dataP.conveniencestore_attach,
        conveniencestore_food_total: dataP.conveniencestore_food_total,
        conveniencestore_food_price: dataP.conveniencestore_food_price,

        conveniencestore_nonfood_total: dataP.conveniencestore_nonfood_total,
        conveniencestore_nonfood_price: dataP.conveniencestore_nonfood_price,

        cafe_attach: dataP.cafe_attach,
        cafe_revenuecafe_total: dataP.cafe_revenuecafe_total,
        cafe_revenuecafe_price: dataP.cafe_revenuecafe_price
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
        dispatch({ type: UPDATE_ERROR_REVENUE });
        NotificationManager.error(response.data.data);
      } else {
        NotificationManager.success(response.data.data);
      }
    })
    .catch(error => catchError(error, dispatch, UPDATE_ERROR_REVENUE));
  dispatch({ type: UPDATE_END_REVENUE });
};

export const searchDateRevenue = date => dispatch => {
  dispatch({ type: SEARCH_DATE_REVENUE, payload: date });
};

export const addDataRevenue = (dataP, branchP) => async dispatch => {
  const userL =
    localStorage.getItem(STORAGE_USERMODELS) === null
      ? null
      : JSON.parse(decryptData(localStorage.getItem(STORAGE_USERMODELS)));

  dispatch({ type: ADD_START_REVENUE });
  await axios
    .post(
      AppConfig.serviceUrl + "revenue/insert",
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
        dispatch({ type: ADD_ERROR_REVENUE });
        NotificationManager.error(response.data.data);
      } else {
        NotificationManager.success(response.data.data);
      }
    })
    .catch(error => catchError(error, dispatch, ADD_ERROR_REVENUE));
  dispatch({ type: ADD_END_REVENUE });
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
