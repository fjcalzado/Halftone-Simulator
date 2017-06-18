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

  // Add class name from parent.
  className?: string;

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
      <ColorPickerToggleableComponent className={`${this.props.className || ""}
                                                  ${this.props.theme.container || ""}`.trim()}
        label={"Background"}
        color={this.props.color}
        toggled={this.props.customColor}
        disableAlpha={true}
        onChangeColor={this.props.onChangeColor}
        onChangeToggle={this.props.onChangeToggle}
        disabled={false}
      />
    );
  }
}
export const BackgroundColorPickerComponent = themr(identifiers.backgroundColorPicker)(BackgroundColorPicker);