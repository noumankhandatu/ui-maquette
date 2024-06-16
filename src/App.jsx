import { App as AntdApp } from "antd";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ConfigProvider } from "antd";
import frFR from "antd/locale/fr_FR";

import { store, persistor } from "./redux/store";

import "antd/dist/reset.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";

import Router from "./router";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AntdApp>
          <div className="App">
            <ConfigProvider locale={frFR}>
              <Router />
            </ConfigProvider>
          </div>
        </AntdApp>
      </PersistGate>
    </Provider>
  );
}

export default App;
