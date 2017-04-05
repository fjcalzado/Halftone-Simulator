import * as React from "react";
const styles = require("./sliderTheme.scss");

interface IProps {
  initialValue: number;
  range: {min: number,
          max: number,
          step: number};
  onValueChanged?: (newValue: number) => void;
};

interface IState {
  value: number;
};

export class SliderComponent extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {value: props.initialValue};
  }

  public render() {
    return(
      <div className={styles.container}>
        <input className={styles.slider}
              type="range"
              min={this.props.range.min}
              max={this.props.range.max}
              step={this.props.range.step}
              value={this.state.value}
              onChange={this.valueChanged}
        />
        <span className={styles.label}>{this.state.value}</span>
      </div>
    );
  }

  private valueChanged = (event: any) => {
    this.setState({value: event.target.value});
    if (this.props.onValueChanged) {
      this.props.onValueChanged(event.target.value);
    }
  }
};
