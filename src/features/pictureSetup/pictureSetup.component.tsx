/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";

import { identifiers } from "../../identifiers";
import { BackgroundColorPickerComponent } from "./components/backgroundColorPicker";


/******************* INTERFACE *******************/

interface Props {
  imageUrl: string;
  resolution: number;
  autoResolution: boolean;
  customBackgroundColor: boolean;
  backgroundColor: any;

  onImageURLChange: (newImageURL: string) => void;
  onResolutionChange: (newResolution: number) => void;
  onAutoResolutionChange: (newAuto: boolean) => void;
  onBackgroundColorChange: (newColor: any) => void;
  onBackgroundToggleChange: (newToggled: boolean) => void;

  // Context theme API.
  theme?: {
    container: string;
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
          <BackgroundColorPickerComponent className={""}
            customColor={this.props.customBackgroundColor}
            color={this.props.backgroundColor}
            onChangeColor={this.props.onBackgroundColorChange}
            onChangeToggle={this.props.onBackgroundToggleChange}
          />
      </div>
    );
  }
}
export const PictureSetupComponent = themr(identifiers.pictureSetup)(PictureSetup);
