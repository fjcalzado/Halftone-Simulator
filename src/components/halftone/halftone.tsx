import * as React from "react";
import * as hCore from "./halftoneCore";
const styles = require("./halftoneTheme.scss");

interface IProps {
  image: number[][];
  resolution?: number;
  // Optional Size. Fit the container by default.
  width?: string;
  height?: string;
}

export class HalftoneComponent extends React.Component<IProps, {}> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // TODO: Exported variables from core as component state.
    // TODO: halftoneCore only export methods.
    hCore.initialize(styles.container, this.props.image,
      this.props.width, this.props.height);
    hCore.initializeChart();
    hCore.initializeScales();
    hCore.initializeSelection();
  }

  public render() {
    return(
      <div className={styles.container}>
      </div>
    );
  }
};

