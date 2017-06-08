/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";

import { identifiers } from "../../identifiers";
import { SampleImageItem } from "../../models/sampleImageModel";
import { BackgroundColorPickerComponent } from "./components/backgroundColorPicker";
import { SliderExComponent } from "../../components/sliderEx";
import { PictureSelectorComponent } from "./components/pictureSelector";
import { PictureUploadComponent } from "../../components/pictureUpload";


/******************* INTERFACE *******************/

interface Props {
  imageUrl: string;
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
    resolutionPicker: string;
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
          <BackgroundColorPickerComponent className={this.props.theme.backgroundColorPicker}
            customColor={this.props.customBackgroundColor}
            color={this.props.backgroundColor}
            onChangeColor={this.props.onBackgroundColorChange}
            onChangeToggle={this.props.onBackgroundToggleChange}
          />
          <SliderExComponent className={this.props.theme.resolutionPicker}
            editable min={1000} max={100000}
            displayMin={1} displayMax={100} displayStep={0.1}
            label={"Resolution"}
            value={this.props.resolution}
            debounce={true}
            onChange={this.props.onResolutionChange}
          />
          <PictureSelectorComponent className={this.props.theme.pictureSelector}
            imageUrl={this.props.imageUrl}
            sampleImageList={this.props.sampleImageList}
            onImageUrlChange={this.props.onImageUrlChange}
          />
          <PictureUploadComponent className={this.props.theme.pictureUpload}
            imageUrl={""}
            onImageUrlChange={this.props.onImageUrlChange}
          />
      </div>
    );
  }
}
export const PictureSetupComponent = themr(identifiers.pictureSetup)(PictureSetup);


