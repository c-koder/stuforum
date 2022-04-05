import React from "react";
import ReactDOM from "react-dom";

import "./styles/index.css";
import "./styles/loader.scss";
import "bootstrap-icons/font/bootstrap-icons.css";

import reportWebVitals from "./reportWebVitals";

import Routing from "./router/Routing";

ReactDOM.render(
  <React.StrictMode>
    <Routing />
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
