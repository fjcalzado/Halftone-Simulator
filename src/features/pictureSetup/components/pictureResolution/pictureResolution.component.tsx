/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";

import { identifiers } from "../../../../identifiers";
import { TooltipIcon } from "../../../../components/tooltipIcon";
import { SliderExComponent } from "../../../../components/sliderEx";

/******************* INTERFACE *******************/

interface Props {
  resolution: number;
  onResolutionChange: (newResolution: number) => void;

  // Add class name from parent.
  className?: string;

  // Context theme API.
  theme?: {
    container: string;
    icon: string;
    slider: string;
  };
}


/******************* COMPONENT *******************/

class PictureResolution extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  public render() {
    return(
      <div className={`${this.props.className || ""} ${this.props.theme.container}`.trim()}>
        <TooltipIcon className={this.props.theme.icon}
          value="grid_on" tooltip="Resolution"/>
        <SliderExComponent className={this.props.theme.slider}
          editable min={1000} max={100000}
          displayMin={1} displayMax={100} displayStep={0.1}
          value={this.props.resolution}
          debounce={true}
          onChange={this.props.onResolutionChange}
        />
      </div>
    );
  }
}
export const PictureResolutionComponent = themr(identifiers.pictureResolution)(PictureResolution);

