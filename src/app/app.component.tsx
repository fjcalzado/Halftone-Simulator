/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";

import { identifiers } from "../identifiers";
import { LayerStack } from "../models/layerModel";
import { SampleImageItem } from "../models/sampleImageModel";
import { Preset, PresetCollection } from "../models/presetModel";
import { NavigationBarComponent } from "../features/navigationBar";
import { HalftoneComponent } from "../features/halftone";
import { LayerSetupContainer } from "../features/layerSetup";
import { PictureSetupComponent } from "../features/pictureSetup";
import { PresetSelectorComponent } from "../features/presetSelector";
import { SetupLayoutComponent } from "../features/setupLayout";

// TODO: To be deleted **************************************
import { IntroComponent } from "../tmp-mocks/introMock";


/******************* INTERFACE *******************/

interface Props {
  layerStack: LayerStack;
  maxNumLayers: number;
  imageUrl: string;
  sampleImageList: SampleImageItem[];
  resolution: number;
  autoResolution: boolean;
  backgroundColor: any;
  customBackgroundColor: boolean;
  presetList: PresetCollection;

  onImageUrlChange: (newImageURL: string) => void;
  onResolutionChange: (newResolution: number) => void;
  onAutoResolutionChange: (newAuto: boolean) => void;
  onBackgroundColorChange: (newColor: any) => void;
  onBackgroundToggleChange: (newToggled: boolean) => void;
  onLayersChange: (layerStack: LayerStack) => void;
  onPresetChange: (preset: Preset) => void;

  // Context theme API.
  theme?: {
    layoutAppContainer: string;
    layoutNavigationContainer: string;
    layoutDecorator: string;
    layoutMainContainer: string;
    panelLeft: string;
    panelMain: string;
  };
}


/******************* COMPONENT *******************/

class App extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  public render() {
    return(
      <div className={this.props.theme.layoutAppContainer}>

        <div className={this.props.theme.layoutNavigationContainer}>
          <NavigationBarComponent />
        </div>

        <div className={this.props.theme.layoutDecorator} />

        <div className={this.props.theme.layoutMainContainer}>
          <div className={this.props.theme.panelLeft}>
            <SetupLayoutComponent tabsContent={[
              {
                title: "Picture",
                icon: "image",
                content: (
                  <PictureSetupComponent className={"TODO"}
                    sampleImageList={this.props.sampleImageList}
                    resolution={this.props.resolution}
                    autoResolution={this.props.autoResolution}
                    customBackgroundColor={this.props.customBackgroundColor}
                    backgroundColor={this.props.backgroundColor}
                    onImageUrlChange={this.props.onImageUrlChange}
                    onResolutionChange={this.props.onResolutionChange}
                    onAutoResolutionChange={this.props.onAutoResolutionChange}
                    onBackgroundColorChange={this.props.onBackgroundColorChange}
                    onBackgroundToggleChange={this.props.onBackgroundToggleChange}
                  />
                ),
              },
              {
                title: "Presets",
                icon: "group_work",
                content: (
                  <PresetSelectorComponent
                    presetList={this.props.presetList}
                    onPresetChange={this.props.onPresetChange}
                  />
                ),
              },
              {
                title: "Editor",
                icon: "tune",
                content: (
                  <LayerSetupContainer layerStack={this.props.layerStack}
                    maxNumLayers={this.props.maxNumLayers}
                    onApplyLayersChange={this.props.onLayersChange}
                  />
                ),
              },
            ]} />
          </div>
          <div className={this.props.theme.panelMain}>
            <HalftoneComponent layerStack={this.props.layerStack}
              imageUrl={this.props.imageUrl}
              resolution={this.props.resolution}
              backgroundColor={this.props.backgroundColor}
              customBackgroundColor={this.props.customBackgroundColor}
            />
          </div>
        </div>
      </div>
    );
  }
}
export const AppComponent = themr(identifiers.app)(App);


