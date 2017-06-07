/******************* IMPORT *******************/
import * as React from "react";

import { SampleImages } from "./sample-images";
import { TestImages } from "./test-images";
import { SampleImageItem } from "../models/sampleImageModel";
import { LayerStack, CreateDefaultLayerParams } from "../models/layerModel";
import { AppComponent } from "./app.component";

/******************* INTERFACE *******************/

interface State {
  layerStack: LayerStack;
  maxNumLayers: number;
  imageUrl: string;
  sampleImageList: SampleImageItem[];
  resolution: number;
  autoResolution: boolean;
  backgroundColor: any;
  customBackgroundColor: boolean;
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
      imageUrl: SampleImages.find((item) => item.value === "lu").url,
      sampleImageList: SampleImages,
      resolution: 10000,
      autoResolution: true,
      backgroundColor: "rgb(255, 255, 255)",
      customBackgroundColor: false,
    };
  }

  private handleGenericStateChange = (field, value): void => {
    this.setState({
      ...this.state,
      [field]: value,
    });
  }

  public render() {
    return(
      <AppComponent
        layerStack={this.state.layerStack}
        maxNumLayers={this.state.maxNumLayers}
        imageUrl={this.state.imageUrl}
        sampleImageList={this.state.sampleImageList}
        resolution={this.state.resolution}
        autoResolution={this.state.autoResolution}
        backgroundColor={this.state.backgroundColor}
        customBackgroundColor={this.state.customBackgroundColor}
        onImageUrlChange={this.handleGenericStateChange.bind(this, "imageUrl")}
        onResolutionChange={this.handleGenericStateChange.bind(this, "resolution")}
        onAutoResolutionChange={this.handleGenericStateChange.bind(this, "autoResolution")}
        onBackgroundColorChange={this.handleGenericStateChange.bind(this, "backgroundColor")}
        onBackgroundToggleChange={this.handleGenericStateChange.bind(this, "customBackgroundColor")}
        onDrawLayersChange={this.handleGenericStateChange.bind(this, "layerStack")}
      />
    );
  }
}

