import * as React from "react";
import * as ReactDOM from "react-dom";

import { HalftoneComponent } from "./features/halftone";
import { LayerSetupComponent } from "./features/layerSetup";

// TODO: To be deleted **************************************
import { IntroComponent } from "./tmp-mocks/introMock";
import { multiLayerStack } from "./tmp-mocks/layerStackMock";
// **********************************************************

const styles = require("./app.scss");


// Main render entry point.
ReactDOM.render(
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
  , document.getElementById("appContainer"));
