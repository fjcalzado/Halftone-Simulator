/******************* IMPORT *******************/
import * as React from "react";
import * as d3 from "d3";
import { themr } from "react-css-themr";
import { Slider } from "react-toolbox/lib/slider";

import { identifiers } from "../../identifiers";


/******************* INTERFACE *******************/

interface Props {
  onChange: (value: number) => void;
  className?: string;
  disabled?: boolean;
  editable?: boolean;
  max?: number;
  min?: number;
  displayMin?: number;
  displayMax?: number;
  pinned?: boolean;
  snaps?: boolean;
  displayStep?: number;
  value?: number;
  label?: string;

  theme?: {
    container: string,
    label: string,
    slider: string,
  };
}

/******************* COMPONENT *******************/

class SliderEx extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  public static defaultProps: Partial<Props> = {
    className: "",
    disabled: false,
    editable: false,
    max: 100,
    min: 0,
    displayMax: 100,
    displayMin: 0,
    pinned: false,
    snaps: false,
    displayStep: 0.01,
    value: 0,
    label: "",
  };

  private handleOnChange = (value: number): void => {
    this.props.onChange(this.scale().invert(value));
  }

  private scale = () => {
    return d3.scaleLinear()
      .domain([this.props.min, this.props.max])
      .range([this.props.displayMin, this.props.displayMax]);
  }

  public render() {
    return(
      <div className={this.props.theme.container}>
        <p className={this.props.theme.label}>{this.props.label}</p>
        <Slider
          className={`${this.props.className} ${this.props.theme.slider}`}
          disabled={this.props.disabled}
          editable={this.props.editable}
          max={this.props.displayMax}
          min={this.props.displayMin}
          pinned={this.props.pinned}
          snaps={this.props.snaps}
          step={this.props.displayStep}
          value={Math.round(this.scale()(this.props.value) / this.props.displayStep) * this.props.displayStep}
          onChange={this.handleOnChange}
        />
      </div>
    );
  }
}
export const SliderExComponent = themr(identifiers.sliderEx)(SliderEx);
