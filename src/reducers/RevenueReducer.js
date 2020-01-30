/**
 * Auth User Reducers
 */
import {
  FETCH_START_REVENUE,
  FETCH_END_REVENUE,
  FETCH_ERROR_REVENUE,
  SEND_START_REVENUE,
  SEND_END_REVENUE,
  SEND_ERROR_REVENUE
} from "Actions/types";

/**
 * initial auth user
 */
const INIT_STATE = {
  data: null,
  loading: false,
  error: false
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
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
