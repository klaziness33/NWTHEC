/**
 * Users Routes
 */
/* eslint-disable */
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

// async components
import { AsyncExpenseComponent } from "Components/AsyncComponent/AsyncComponent";

const Forms = ({ match }) => (
  <div className="content-wrapper">
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/expense-management`} />
      <Route
        path={`${match.url}/expense-management`}
        component={AsyncExpenseComponent}
      />
    </Switch>
  </div>
);

export default Forms;
