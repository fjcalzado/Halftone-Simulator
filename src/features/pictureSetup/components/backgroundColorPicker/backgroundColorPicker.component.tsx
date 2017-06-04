/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";

import { identifiers } from "../../../../identifiers";
import { ColorPickerToggleableComponent } from "../../../../components/colorPickerToggleable";


/******************* INTERFACE *******************/

interface Props {
  customColor: boolean;
  color: any;
  onChangeColor: (newColor: any) => void;
  onChangeToggle: (newToggled: boolean) => void;

  // Context theme API.
  theme?: {
    container: string;
  };
}


/******************* COMPONENT *******************/

class BackgroundColorPicker extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  public render() {
    return(
      <ColorPickerToggleableComponent className={this.props.theme.container}
        label={"Background Color"}
        color={this.props.color}
        toggled={this.props.customColor}
        disableAlpha={false}
        onChangeColor={this.props.onChangeColor}
        onChangeToggle={this.props.onChangeToggle}
        disabled={false}
      />
    );
  }
}
export const BackgroundColorPickerComponent = themr(identifiers.backgroundColorPicker)(BackgroundColorPicker);