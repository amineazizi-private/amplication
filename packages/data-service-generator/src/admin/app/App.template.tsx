import React, { useEffect, useState } from "react";
import { Admin, DataProvider, Resource } from "react-admin";
//@ts-ignore
import dataProvider from "./data-provider/graphqlDataProvider";
//@ts-ignore
import { theme } from "./theme/theme";
//@ts-ignore
import Login from "./Login";
import "./App.scss";
//@ts-ignore
import Dashboard from "./pages/Dashboard";

declare const AUTH_PROVIDER_NAME: any;
declare const RESOURCES: React.ReactElement[];
declare const RESOURCE_NAME = "my resource name";

const App = (): React.ReactElement => {
  return (
    <div className="App">
      <Admin
        title={RESOURCE_NAME}
        dataProvider={dataProvider}
        authProvider={AUTH_PROVIDER_NAME}
        theme={theme}
        dashboard={Dashboard}
        loginPage={Login}
      >
        {RESOURCES}
      </Admin>
    </div>
  );
};

export default App;
