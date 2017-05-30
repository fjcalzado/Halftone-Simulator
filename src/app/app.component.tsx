/******************* IMPORT *******************/
import * as React from "react";
import { ThemeProvider } from "react-css-themr";

import { contextStylesheets } from "../stylesheets";
import { LayerStack } from "../models/layerModel";
import { HalftoneComponent } from "../features/halftone";
import { LayerSetupContainer } from "../features/layerSetup";
const styles = require("../stylesheets/base/app.scss");

// TODO: To be deleted **************************************
import { IntroComponent } from "../tmp-mocks/introMock";


/******************* INTERFACE *******************/

interface Props {
  layerStack: LayerStack;
  maxNumLayers: number;
  imageUrl: string;
  resolution: number;
  backgroundColor: any;
  onDrawLayersChange: (layerStack: LayerStack) => void;
}


/******************* COMPONENT *******************/

export class AppComponent extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  public render() {
    return(
      <ThemeProvider theme={contextStylesheets}>
        <div className={styles.layoutContainerColumn}>
          <IntroComponent fakeProperty={true} />
          <div className={styles.layoutContainerRow}>
            <div className={styles.panelLeft}>
              <LayerSetupContainer layerStack={this.props.layerStack}
                maxNumLayers={this.props.maxNumLayers}
                onDrawLayersChange={this.props.onDrawLayersChange}
              />
            </div>
            <div className={styles.panelMain}>
              {/*<HalftoneComponent layerStack={this.props.layerStack}
                imageUrl={this.props.imageUrl}
                resolution={this.props.resolution}
                backgroundColor={this.props.backgroundColor}
              />*/}
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  }
};
