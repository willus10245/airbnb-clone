import * as React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { RegisterConnecter } from "../modules/register/RegisterConnecter";

export const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact={true} path="/register" component={RegisterConnecter} />
    </Switch>
  </BrowserRouter>
);
