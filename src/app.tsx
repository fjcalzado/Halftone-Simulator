import * as React from "react";
import * as ReactDOM from "react-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import { HalftoneComponent } from "./features/halftone";
import { LayerSetupComponent } from "./features/layerSetup";

// MOCK DATA. TO BE DELETED *********************************
import { IntroComponent } from "./tmp-mocks/introMock";
import { multiLayerStack } from "./tmp-mocks/layerStackMock";
// **********************************************************

const styles = require("./app.theme.scss");


// Temporary solution needed for onTouchTap.
// https://www.npmjs.com/package/material-ui
// http://stackoverflow.com/a/34015469/988941
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();


// Main render entry point.
ReactDOM.render(
  <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
    <div className={styles.layoutColContainer}>
      <IntroComponent />
      <div className={styles.layoutRowContainer}>
        <div className={styles.layoutLeftPanel}>
          <LayerSetupComponent layerStack={multiLayerStack} />
        </div>
        <div className={styles.layoutMainPanel}>
          {/*<HalftoneComponent imageUrl={"../res/img/lu.jpg"}
                             resolution={10000}
                             width={"100%"}
                             height={"100%"}
          />*/}
        </div>
      </div>
    </div>
  </MuiThemeProvider>
  , document.getElementsByClassName("app-container")[0]);
