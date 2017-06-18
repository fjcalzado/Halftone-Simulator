import * as React from "react";
import * as ReactDOM from "react-dom";
import { ThemeProvider } from "react-css-themr";

import { contextStylesheets } from "../stylesheets";
import { AppContainer } from "./app.container";

// TODO: Set theme class name to body in order for auto themer to
// work. Find a cleaner method to export all the themes identNames
// and a way of selecting them.
document.body.setAttribute("class", /*TODO*/"theme-light");

// Main render entry point.
ReactDOM.render(
  <ThemeProvider theme={contextStylesheets}>
    <AppContainer />
  </ThemeProvider>
  , document.getElementById("appContainer"));
