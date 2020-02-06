/**
 * Auth User Reducers
 */
import {
  FETCH_START_REVENUE,
  FETCH_END_REVENUE,
  FETCH_ERROR_REVENUE,
  SEND_START_REVENUE,
  SEND_END_REVENUE,
  SEND_ERROR_REVENUE,
  ERROR_UNAUTHORIZED_REVENUE,
  ERROR_NETWORK_REVENUE,
  ERROR_OTHER_REVENUE
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
    case ERROR_OTHER_REVENUE:
      return { ...state, error: true, loading: true };

    case ERROR_UNAUTHORIZED_REVENUE:
      return { ...state, unauthorized: true, loading: true };

    case ERROR_NETWORK_REVENUE:
      return { ...state, network: true, loading: true };

    case SEND_START_REVENUE:
      return { ...state, data: null, loading: true };

    case SEND_END_REVENUE:
      return { ...state, data: action.payload, loading: false };

    case SEND_ERROR_REVENUE:
      return { ...state, error: true, loading: true };

    case FETCH_START_REVENUE:
      return { ...state, data: null, loading: true };

    case FETCH_END_REVENUE:
      return { ...state, data: action.payload, loading: false };

    case FETCH_ERROR_REVENUE:
      return { ...state, error: true, loading: true };

    default:
      return { ...state };
  }
};
