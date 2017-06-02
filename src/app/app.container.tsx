/******************* IMPORT *******************/
import * as React from "react";

import { SampleImages } from "./sample-images";
import { LayerStack, CreateDefaultLayerParams } from "../models/layerModel";
import { AppComponent } from "./app.component";

/******************* INTERFACE *******************/

interface State {
  layerStack: LayerStack;
  maxNumLayers: number;
  imageUrl: string;
  resolution: number;
  backgroundColor: any;
}

interface Props {

}


/******************* COMPONENT *******************/

export class AppContainer extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      layerStack: [CreateDefaultLayerParams()],
      maxNumLayers: 4,
      imageUrl: SampleImages.ImgLu,
      resolution: 10000,
      backgroundColor: "rgb(255, 255, 255)",
    };
  }

  private handleDrawLayersChange = (layerStack: LayerStack) => {
    this.setState({...this.state, layerStack} as State);
  }

  public render() {
    return(
      <AppComponent layerStack={this.state.layerStack}
        maxNumLayers={this.state.maxNumLayers}
        imageUrl={this.state.imageUrl}
        resolution={this.state.resolution}
        backgroundColor={this.state.backgroundColor}
        onDrawLayersChange={this.handleDrawLayersChange}
      />
    );
  }
}

