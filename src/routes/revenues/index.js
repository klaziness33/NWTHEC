/**
 * Users Routes
 */
/* eslint-disable */
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { Helmet } from "react-helmet";
// async components
import {
  AsyncRevenuesListComponent,
  AsyncRevenuesCardComponent
} from "Components/AsyncComponent/AsyncComponent";
const Forms = ({ match }) => (
  <div className="content-wrapper">
    <Switch>
      <Redirect
        exact
        from={`${match.url}/`}
        to={`${match.url}/revenues-management-list`}
      />
      <Route
        path={`${match.url}/revenues-management-card`}
        component={AsyncRevenuesCardComponent}
      />
      <Route
        path={`${match.url}/revenues-management-list`}
        component={AsyncRevenuesListComponent}
      />
    </Switch>
  </div>
);

export default Forms;
