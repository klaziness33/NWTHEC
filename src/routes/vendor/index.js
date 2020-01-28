/**
 * Users Routes
 */
/* eslint-disable */
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

// async components
import { AsyncVendorComponent } from "Components/AsyncComponent/AsyncComponent";

const Forms = ({ match }) => (
  <div className="content-wrapper">
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/vendor-management`} />
      <Route
        path={`${match.url}/vendor-management`}
        component={AsyncVendorComponent}
      />
    </Switch>
  </div>
);

export default Forms;
