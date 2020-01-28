/**
 * App Reducers
 */
import { combineReducers } from "redux";
import settings from "./settings";
import chatAppReducer from "./ChatAppReducer";
import emailAppReducer from "./EmailAppReducer";
import sidebarReducer from "./SidebarReducer";
import todoAppReducer from "./TodoAppReducer";
import authUserReducer from "./AuthUserReducer";
import feedbacksReducer from "./FeedbacksReducer";
import ecommerceReducer from "./EcommerceReducer";
import CrmReducer from "./CrmReducer";
import ExpenseReducer from "./ExpenseReducer";
import MasterReducer from "./MasterReducer";
import RevenueReducer from "./RevenueReducer";

const reducers = combineReducers({
  settings,
  chatAppReducer,
  emailApp: emailAppReducer,
  sidebar: sidebarReducer,
  todoApp: todoAppReducer,
  authUser: authUserReducer,
  feedback: feedbacksReducer,
  ecommerce: ecommerceReducer,
  CrmReducer: CrmReducer,
  expenseReducer: ExpenseReducer,
  masterReducer: MasterReducer,
  revenueReducer: RevenueReducer
});

export default reducers;