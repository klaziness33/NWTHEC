/**
 * Auth User Reducers
 */
import {
  FETCH_START_VENDOR,
  FETCH_END_VENDOR,
  FETCH_ERROR_VENDOR,
  ERROR_OTHER_VENDOR,
  ERROR_UNAUTHORIZED_VENDOR,
  ERROR_NETWORK_VENDOR
} from "Actions/types";

/**
 * initial auth user
 */
const INIT_STATE = {
  data: null,
  loading: false,
  unauthorized: false,
  network: false,
  error: false
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case ERROR_OTHER_VENDOR:
      return { ...state, error: true, loading: true };

    case ERROR_UNAUTHORIZED_VENDOR:
      return { ...state, unauthorized: true, loading: true };

    case ERROR_NETWORK_VENDOR:
      return { ...state, network: true, loading: true };

    case FETCH_START_VENDOR:
      return { ...state, data: null, loading: true };

    case FETCH_END_VENDOR:
      return { ...state, data: action.payload, loading: false };

    case FETCH_ERROR_VENDOR:
      return { ...state, error: true, loading: true };

    default:
      return { ...state };
  }
};
