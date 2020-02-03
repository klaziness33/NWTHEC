/**
 * Auth User Reducers
 */
import {
  FETCH_START_VENDOR,
  FETCH_END_VENDOR,
  FETCH_ERROR_VENDOR
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
