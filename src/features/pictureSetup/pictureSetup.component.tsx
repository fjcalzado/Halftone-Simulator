/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";

import { identifiers } from "../../identifiers";
import { SampleImageItem } from "../../models/sampleImageModel";
import { BackgroundColorPickerComponent } from "./components/backgroundColorPicker";
import { PictureSelectorComponent } from "./components/pictureSelector";
import { PictureUploadComponent } from "./components/pictureUpload";
import { PictureResolutionComponent } from "./components/pictureResolution";



/******************* INTERFACE *******************/

interface Props {
  sampleImageList: SampleImageItem[];
  resolution: number;
  autoResolution: boolean;
  customBackgroundColor: boolean;
  backgroundColor: any;

  onImageUrlChange: (newImageURL: string) => void;
  onResolutionChange: (newResolution: number) => void;
  onAutoResolutionChange: (newAuto: boolean) => void;
  onBackgroundColorChange: (newColor: any) => void;
  onBackgroundToggleChange: (newToggled: boolean) => void;

  // Context theme API.
  theme?: {
    container: string;
    backgroundColorPicker: string;
    pictureResolution: string;
    pictureSelector: string;
    pictureUpload: string;
  };
}


/******************* COMPONENT *******************/

class PictureSetup extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  public render() {

    return(
      <div className={this.props.theme.container}>
         <PictureUploadComponent className={this.props.theme.pictureUpload}
          onImageUrlChange={this.props.onImageUrlChange}
        />
        <PictureResolutionComponent className={this.props.theme.pictureResolution}
          resolution={this.props.resolution}
          onResolutionChange={this.props.onResolutionChange}
        />
        <BackgroundColorPickerComponent className={this.props.theme.backgroundColorPicker}
          customColor={this.props.customBackgroundColor}
          color={this.props.backgroundColor}
          onChangeColor={this.props.onBackgroundColorChange}
          onChangeToggle={this.props.onBackgroundToggleChange}
        />
        <PictureSelectorComponent className={this.props.theme.pictureSelector}
          sampleImageList={this.props.sampleImageList}
          onImageUrlChange={this.props.onImageUrlChange}
        />
      </div>
    );
  }
}
export const PictureSetupComponent = themr(identifiers.pictureSetup)(PictureSetup);


