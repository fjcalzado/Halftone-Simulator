/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { ChromePicker  } from "react-color";
import { Dialog } from "react-toolbox/lib/dialog";

import { identifiers } from "../../identifiers";


/******************* INTERFACE *******************/

interface State {
  displayColorPicker: boolean;
}

interface Props {
  color: any;
  disableAlpha: boolean;
  onChange: (color) => void;
  disabled?: boolean;

  // Add class name from parent.
  className?: string;

  // Context theme API.
  theme?: {
    container: string,
    swatch: string,
    open: string,
    disabled: string,
    dialog: string,
    palette: string,
  };
}

/******************* COMPONENT *******************/

class ColorPicker extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      displayColorPicker: false,
    };
  }

  private handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  }

  private handleClose = () => {
    this.setState({ displayColorPicker: false });
  }

  private handleChange = (color) => {
    this.props.onChange(color.hex);
  }

  public render() {
    const open = Boolean(this.state.displayColorPicker);
    const disabled = this.props.disabled;
    return(
      <div className={`${this.props.className || ""} ${this.props.theme.container}`.trim()}>
        <div className={`${this.props.theme.swatch}
                         ${disabled ? this.props.theme.disabled : ""}
                         ${open ? this.props.theme.open : ""}`}
          onClick={this.handleClick}
          style={{background: this.props.color}}
        />
        <Dialog className={this.props.theme.dialog}
          title="Pick Color"
          actions={[{label: "Ok", onClick: this.handleClose}]}
          onEscKeyDown={this.handleClose}
          onOverlayClick={this.handleClose}
          active={this.state.displayColorPicker}
        >
          <ChromePicker color={this.props.color} onChange={this.handleChange}
            disableAlpha={this.props.disableAlpha} />
        </Dialog>
      </div>
    );
  }
}
export const ColorPickerComponent = themr(identifiers.colorPicker)(ColorPicker);
