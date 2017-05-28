/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { SketchPicker } from "react-color";

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

  theme?: {
    container: string,
    swatch: string,
    open: string,
    disabled: string,
    popover: string,
    cover: string,
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
      <div>
        <div className={`${this.props.theme.swatch} 
                         ${disabled ? this.props.theme.disabled : ""}
                         ${open ? this.props.theme.open : ""}`}
          onClick={this.handleClick}
          style={{background: this.props.color}} />
        { open ? <div className={this.props.theme.popover}>
          <div className={this.props.theme.cover} onClick={this.handleClose}/>
          <SketchPicker color={this.props.color} onChange={this.handleChange}
            disableAlpha={this.props.disableAlpha} />
        </div> : null }
      </div>
    );
  }
}
export const ColorPickerComponent = themr(identifiers.colorPicker)(ColorPicker);