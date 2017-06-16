/******************* IMPORT *******************/
import * as React from "react";
import { ThemeProvider } from "react-css-themr";

import { contextStylesheets } from "../stylesheets";
import { LayerStack } from "../models/layerModel";
import { SampleImageItem } from "../models/sampleImageModel";
import { Preset, PresetCollection } from "../models/presetModel";
import { HalftoneComponent } from "../features/halftone";
import { LayerSetupContainer } from "../features/layerSetup";
import { PictureSetupComponent } from "../features/pictureSetup";
import { PresetSelectorComponent } from "../features/presetSelector";
import { SetupLayoutComponent } from "../features/setupLayout";
const styles = require("../stylesheets/base/app.scss");

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
              <SetupLayoutComponent tabsContent={[
                {
                  title: "Picture",
                  content: (
                    <PictureSetupComponent className={"TODO"}
                      imageUrl={this.props.imageUrl}
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
                  content: (
                    <PresetSelectorComponent
                      presetList={this.props.presetList}
                      onPresetChange={this.props.onPresetChange}
                    />
                  ),
                },
                {
                  title: "Configuration",
                  content: (
                    <LayerSetupContainer layerStack={this.props.layerStack}
                      maxNumLayers={this.props.maxNumLayers}
                      onApplyLayersChange={this.props.onLayersChange}
                    />
                  ),
                },
              ]} />
            </div>
            <div className={styles.panelMain}>
              <HalftoneComponent layerStack={this.props.layerStack}
                imageUrl={this.props.imageUrl}
                resolution={this.props.resolution}
                backgroundColor={this.props.backgroundColor}
                customBackgroundColor={this.props.customBackgroundColor}
              />
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  }
}


