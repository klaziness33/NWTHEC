/**
 * Auth User Reducers
 */
import {
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILURE,
  LOGOUT_USER,
  SIGNUP_USER,
  SIGNUP_USER_SUCCESS,
  SIGNUP_USER_FAILURE
} from "Actions/types";

import { STORAGE_USERMODELS } from "../store/storages";

import { decryptData } from "../helpers/helpers";
/**
 * initial auth user
 */
const INIT_STATE = {
  // user: JSON.parse(decryptData(localStorage.getItem(STORAGE_USERMODELS))),
  user:
    localStorage.getItem(STORAGE_USERMODELS) === null
      ? null
      : JSON.parse(decryptData(localStorage.getItem(STORAGE_USERMODELS))),
  loading: false
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, loading: true };

    case LOGIN_USER_SUCCESS:
      return { ...state, loading: false, user: action.payload };

    case LOGIN_USER_FAILURE:
      return { ...state, loading: false };

    case LOGOUT_USER:
      return { ...state, user: null };

    case SIGNUP_USER:
      return { ...state, loading: true };

    case SIGNUP_USER_SUCCESS:
      return { ...state, loading: false, user: action.payload };

    case SIGNUP_USER_FAILURE:
      return { ...state, loading: false };

    default:
      return { ...state };
  }
};
