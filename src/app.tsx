import * as React from "react";
import * as ReactDOM from "react-dom";
import { ThemeProvider } from "react-css-themr";

import { HalftoneComponent } from "./features/halftone";
import { LayerSetupComponent } from "./features/layerSetup";
import { ContextTheme } from "./stylesheets";

// TODO: To be deleted **************************************
import { IntroComponent } from "./tmp-mocks/introMock";
import { multiLayerStack } from "./tmp-mocks/layerStackMock";
// **********************************************************

const styles = require("./stylesheets/base/app.scss");

// TODO: Set theme class name to body in order for auto themer to
// work. Find a cleaner method to export all the themes identNames
// and a way of selecting them.
document.body.setAttribute("class", styles.themeLight);

// Main render entry point.
ReactDOM.render(
  <ThemeProvider theme={ContextTheme}>
    <div className={styles.layoutContainerColumn}>
      <IntroComponent />
      <div className={styles.layoutContainerRow}>
        <div className={styles.panelLeft}>
          <LayerSetupComponent layerStack={multiLayerStack} />
        </div>
        <div className={styles.panelMain}>
          {/*<HalftoneComponent imageUrl={"../res/img/lu.jpg"}
                              resolution={10000}
                              width={"100%"}
                              height={"100%"}
          />*/}
        </div>
      </div>
    </div>
  </ThemeProvider>
  , document.getElementById("appContainer"));
