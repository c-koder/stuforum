import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Routing from "./Routing";

ReactDOM.render(
  <BrowserRouter>
    <Routing />
  </BrowserRouter>,

  document.getElementById("root")
);

reportWebVitals();
