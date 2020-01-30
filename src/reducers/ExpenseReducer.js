/**
 * Auth User Reducers
 */
import {
  FETCH_START_EXPENSE,
  FETCH_END_EXPENSE,
  FETCH_ERROR_EXPENSE,
  ADD_START_EXPENSE,
  ADD_END_EXPENSE,
  ADD_ERROR_EXPENSE,
  UPDATE_START_EXPENSE,
  UPDATE_END_EXPENSE,
  UPDATE_ERROR_EXPENSE,
  DEL_START_EXPENSE,
  DEL_END_EXPENSE,
  DEL_ERROR_EXPENSE,
  SEARCH_DATE_EXPENSE
} from "Actions/types";

/**
 * initial auth user
 */
const INIT_STATE = {
  datetime: Date.now(),
  data: null,
  loading: false,
  error: false
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case FETCH_START_EXPENSE:
      return { ...state, data: null, loading: true };

    case FETCH_END_EXPENSE:
      return { ...state, data: action.payload, loading: false };

    case FETCH_ERROR_EXPENSE:
      return { ...state, error: true, loading: false };

    case ADD_START_EXPENSE:
      return { ...state, loading: true };

    case ADD_END_EXPENSE:
      return { ...state, loading: false };

    case ADD_ERROR_EXPENSE:
      return { ...state, error: true, loading: false };

    case UPDATE_START_EXPENSE:
      return { ...state, loading: true };

    case UPDATE_END_EXPENSE:
      return { ...state, loading: false };

    case UPDATE_ERROR_EXPENSE:
      return { ...state, error: true, loading: false };

    case DEL_START_EXPENSE:
      return { ...state, loading: true };

    case DEL_END_EXPENSE:
      return { ...state, loading: false };

    case DEL_ERROR_EXPENSE:
      return { ...state, error: true, loading: false };

    case SEARCH_DATE_EXPENSE:
      return { ...state, datetime: action.payload };

    default:
      return { ...state };
  }
};
