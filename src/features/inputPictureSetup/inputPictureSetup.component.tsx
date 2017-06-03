/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";

import { identifiers } from "../../identifiers";


/******************* INTERFACE *******************/

interface Props {
  imageUrl: string;
  resolution: number;
  autoResolution: number;
  backgroundColor: any;

  onImageURLChange: (newImageURL: string) => void;
  onResolutionChange: (newResolution: number) => void;
  onBackgroundColorChange: (newColor: string) => void;

  // Context theme API.
  theme?: {
    container: string;
  };
}


/******************* COMPONENT *******************/

class InputPictureSetup extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  public render() {

    return(
      <div className={this.props.theme.container}>
      </div>
    );
  }
}
export const InputPictureSetupComponent = themr(identifiers.inputPictureSetup)(InputPictureSetup);
