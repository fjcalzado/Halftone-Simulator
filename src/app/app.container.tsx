/******************* IMPORT *******************/
import * as React from "react";

import { LayerStack, CreateDefaultLayerParams } from "../models/layerModel";
import { SampleImageItem } from "../models/sampleImageModel";
import { Preset, PresetCollection } from "../models/presetModel";
import { SampleImages } from "./sample-images";
import { TestImages } from "./test-images";
import { PresetList } from "./presets";
import { AppComponent } from "./app.component";

/******************* INTERFACE *******************/

interface State {
  // Simulator state.
  layerStack: LayerStack;
  maxNumLayers: number;
  sampleImageList: SampleImageItem[];
  imageUrl: string;
  resolution: number;
  autoResolution: boolean;
  backgroundColor: any;
  customBackgroundColor: boolean;
  presetList: PresetCollection;

  // Web config state.
  toolPanelPosition: string;
  userTheme: string;
}

interface Props {
}


/******************* COMPONENT *******************/

export class AppContainer extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      layerStack: [CreateDefaultLayerParams()],
      maxNumLayers: 5,
      sampleImageList: SampleImages,
      imageUrl: SampleImages.find((item) => item.value === "lu").url,
      resolution: 10000,
      autoResolution: true,
      backgroundColor: "rgb(255, 255, 255)",
      customBackgroundColor: true,
      presetList: PresetList,
      toolPanelPosition: "left",
      userTheme: "light",
    };
  }

  private setUserTheme(userTheme: string) {
    document.body.setAttribute("class", `theme-${userTheme}`);
  }

  private handleGenericStateChange = (field, value): void => {
    this.setState({
      ...this.state,
      [field]: value,
    });
  }

  private handlePresetChange = (preset: Preset) => {
    this.setState({
      ...this.state,
      layerStack: preset.layerStackJSON as LayerStack,
      backgroundColor: preset.backgroundColor,
      customBackgroundColor: preset.customBackgroundColor,
    });
  }

  private handleUserThemeChange = (userTheme: string) => {
    this.handleGenericStateChange("userTheme", userTheme);
    this.setUserTheme(userTheme);
  }

  public componentWillMount() {
    // Set default theme for the first time.
    this.setUserTheme(this.state.userTheme);
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
        presetList={this.state.presetList}
        onImageUrlChange={this.handleGenericStateChange.bind(this, "imageUrl")}
        onResolutionChange={this.handleGenericStateChange.bind(this, "resolution")}
        onAutoResolutionChange={this.handleGenericStateChange.bind(this, "autoResolution")}
        onBackgroundColorChange={this.handleGenericStateChange.bind(this, "backgroundColor")}
        onBackgroundToggleChange={this.handleGenericStateChange.bind(this, "customBackgroundColor")}
        onLayersChange={this.handleGenericStateChange.bind(this, "layerStack")}
        onPresetChange={this.handlePresetChange}
        toolPanelPosition={this.state.toolPanelPosition}
        onToolPanelPositionChange={this.handleGenericStateChange.bind(this, "toolPanelPosition")}
        userTheme={this.state.userTheme}
        onUserThemeChange={this.handleUserThemeChange}
      />
    );
  }
}

