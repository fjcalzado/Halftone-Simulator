/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { Switch } from "react-toolbox/lib/switch";

import { identifiers } from "../../identifiers";
import { ColorPickerComponent } from "../colorPicker/colorPicker.component";


/******************* INTERFACE *******************/

interface State {
  displayColorPicker: boolean;
}

interface Props {
  label: string;
  color: any;
  toggled: boolean;
  disableAlpha: boolean;
  onChangeColor: (newColor: any) => void;
  onChangeToggle: (newToggled: boolean) => void;
  disabled?: boolean;

  theme?: {
    container: string,
  };
}

/******************* COMPONENT *******************/

class ColorPickerToggleable extends React.Component<Props, State> {
  constructor(props) {
    super(props);
  }

  public render() {
    const open = Boolean(this.state.displayColorPicker);
    const disabled = this.props.disabled;

    return(
      <div className={this.props.theme.container}>
        <Switch checked={this.props.toggled}
          label={this.props.label}
          onChange={this.props.onChangeToggle}
          disabled={this.props.disabled}
        />
        <ColorPickerComponent color={this.props.color}
          disableAlpha={this.props.disableAlpha}
          onChange={this.props.onChangeColor}
          disabled={this.props.disabled}
        />
      </div>
    );
  }
}
export const ColorPickerToggleableComponent = themr(identifiers.colorPickerToggleable)(ColorPickerToggleable);