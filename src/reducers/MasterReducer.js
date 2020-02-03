/**
 * Auth User Reducers
 */
import {
  FETCH_START_BRANCH,
  FETCH_END_BRANCH,
  FETCH_ERROR_BRANCH,
  FETCH_START_PAYMENTTYPE,
  FETCH_END_PAYMENTTYPE,
  FETCH_ERROR_PAYMENTTYPE,
  FETCH_START_ROLE,
  FETCH_END_ROLE,
  FETCH_ERROR_ROLE,
  FETCH_START_VENDOR_MASTER,
  FETCH_END_VENDOR_MASTER,
  FETCH_ERROR_VENDOR_MASTER
} from "Actions/types";

import {
  STORAGE_BRANCH,
  STORAGE_PAYMENTTYPE,
  STORAGE_ROLE,
  STORAGE_VENDOR
} from "../store/storages";
import { decryptData } from "../helpers/helpers";
/**
 * initial auth user
 */
const INIT_STATE = {
  data:
    localStorage.getItem(STORAGE_BRANCH) === null
      ? null
      : JSON.parse(decryptData(localStorage.getItem(STORAGE_BRANCH))),
  paymentType:
    localStorage.getItem(STORAGE_PAYMENTTYPE) === null
      ? null
      : JSON.parse(decryptData(localStorage.getItem(STORAGE_PAYMENTTYPE))),
  role:
    localStorage.getItem(STORAGE_ROLE) === null
      ? null
      : JSON.parse(decryptData(localStorage.getItem(STORAGE_ROLE))),
  loading: false
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case FETCH_START_BRANCH:
      return { ...state, data: null, loading: true };

    case FETCH_END_BRANCH:
      return { ...state, data: action.payload, loading: false };

    case FETCH_ERROR_BRANCH:
      return { ...state, loading: false };

    case FETCH_START_PAYMENTTYPE:
      return { ...state, paymentType: null, loading: true };

    case FETCH_END_PAYMENTTYPE:
      return { ...state, paymentType: action.payload, loading: false };

    case FETCH_ERROR_PAYMENTTYPE:
      return { ...state, loading: false };

    case FETCH_START_ROLE:
      return { ...state, role: null, loading: true };

    case FETCH_END_ROLE:
      return { ...state, role: action.payload, loading: false };

    case FETCH_ERROR_ROLE:
      return { ...state, loading: false };

    default:
      return { ...state };
  }
};
