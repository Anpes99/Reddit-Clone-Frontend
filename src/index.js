import React from "react";
import App from "./App";
import "./styles/globals.css";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { createRoot } from "react-dom/client";
const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
