/**
 * Auth User Reducers
 */
import {
  FETCH_START_BRANCH,
  FETCH_END_BRANCH,
  FETCH_ERROR_BRANCH,
  FETCH_START_PAYMENTTYPE,
  FETCH_END_PAYMENTTYPE,
  FETCH_ERROR_PAYMENTTYPE
} from "Actions/types";

import { STORAGE_BRANCH, STORAGE_PAYMENTTYPE } from "../store/storages";
import { decryptData } from "../helpers/helpers";
/**
 * initial auth user
 */
const INIT_STATE = {
  // data: JSON.parse(decryptData(localStorage.getItem(STORAGE_BRANCH))),
  data:
    localStorage.getItem(STORAGE_BRANCH) === null
      ? null
      : JSON.parse(decryptData(localStorage.getItem(STORAGE_BRANCH))),
  paymentType:
    localStorage.getItem(STORAGE_PAYMENTTYPE) === null
      ? null
      : JSON.parse(decryptData(localStorage.getItem(STORAGE_PAYMENTTYPE))),
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

    default:
      return { ...state };
  }
};
