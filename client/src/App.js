import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// Pages
import Home from "./Components/Home";
import Admin from "./Components/Admin";
import GenerateCert from "./Components/GenerateCert";
import CertificateDisplay from "./Components/CertificateDisplay";
import ViewCert from "./Components/ViewCert";
import Login from "./Components/Login";

const DynamicLayoutRoute = (props) => {
  const { component: RoutedComponent, layout, ...rest } = props;


  const actualRouteComponent = (
    <Route {...rest} render={(props) => <RoutedComponent {...props} />} />
  );

 
  switch (layout) {
    default: {
      return (
        <div>
          <null />
          {actualRouteComponent}
        </div>
      );
    }
  }
};

class App extends Component {
  render() {
    return (
      <div className="App" style={{ backgroundColor: "#fafafa" }}>
        <Switch>
          <DynamicLayoutRoute
            exact
            path="/"
            component={Home}
            layout="LANDING"
          />
          <DynamicLayoutRoute
            exact
            path="/admin"
            component={Admin}
            layout="SYSADMIN"
          />
          <DynamicLayoutRoute
            exact
            path="/institute"
            component={GenerateCert}
            layout="INSTITUTE"
          />
          <DynamicLayoutRoute
            path="/certificate/:id"
            component={CertificateDisplay}
          />
          <DynamicLayoutRoute path="/view" component={ViewCert} />
          <DynamicLayoutRoute path="/login" component={Login} />
          <DynamicLayoutRoute path="*">
            <Redirect to="/" />
          </DynamicLayoutRoute>
        </Switch>
      </div>
    );
  }
}

export default App;
