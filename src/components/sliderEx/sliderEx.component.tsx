/******************* IMPORT *******************/
import * as React from "react";
import * as d3 from "d3";
import { themr } from "react-css-themr";
import { Slider } from "react-toolbox/lib/slider";

import { identifiers } from "../../identifiers";
import { debounce } from "../../util";


/******************* INTERFACE *******************/

interface Props {
  onChange: (value: number) => void;
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
  debounce?: boolean;

  // Add class name from parent.
  className?: string;

  // Context theme API.
  theme?: {
    container: string,
    label: string,
    slider: string,
  };
}

interface State {
  storedValue: number;
}

/******************* COMPONENT *******************/

class SliderEx extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      storedValue: this.applyScaleForDisplay(this.props),
    };
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
    debounce: false,
  };

  private scale = (props: Props) => {
    return d3.scaleLinear()
      .domain([props.min, props.max])
      .range([props.displayMin, props.displayMax]);
  }

  private applyScaleForDisplay = (props: Props): number => {
    return Math.round(this.scale(props)(props.value) / props.displayStep) * props.displayStep;
  }

  private notifyValueChange = (value: number): void => {
    this.props.onChange(this.scale(this.props).invert(value));
  }

  private notifyValueChangeDebounced = debounce(this.notifyValueChange, 800, false);

  private handleOnChange = (notifyFunc) => (value: number): void => {
    this.setState({
      ...this.state,
      storedValue: value,
    });
    notifyFunc(value);
  }

  public componentWillReceiveProps(nextProps) {
    this.setState({
      ...this.state,
      storedValue: this.applyScaleForDisplay(nextProps),
    });
  }

  public render() {
    return(
      <div className={`${this.props.className || ""} ${this.props.theme.container}`.trim()}>
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
          value={this.state.storedValue}
          onChange={this.handleOnChange(this.props.debounce ? this.notifyValueChangeDebounced : this.notifyValueChange)}
        />
      </div>
    );
  }
}
export const SliderExComponent = themr(identifiers.sliderEx)(SliderEx);
