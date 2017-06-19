import * as React from "react";
import * as ReactDOM from "react-dom";
import { ThemeProvider } from "react-css-themr";

import { contextStylesheets } from "../stylesheets";
import { AppContainer } from "./app.container";

// Main render entry point.
ReactDOM.render(
  <ThemeProvider theme={contextStylesheets}>
    <AppContainer />
  </ThemeProvider>
  , document.getElementById("appContainer"));
