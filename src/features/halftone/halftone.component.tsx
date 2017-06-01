/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";

import { identifiers } from "../../identifiers";
import { LayerStack } from "../../models/layerModel";
import { SimulatorComponent } from "./components/simulator";
import { WaitComponent } from "./components/wait";


/******************* INTERFACE *******************/

interface State {
  processing: boolean;
}

interface Props {
  imageUrl: string;
  resolution: number;
  layerStack: LayerStack;
  onNotifyError?: (error: string) => void;

  // Optionals.
  // Background color. White by default.
  // Size. Fit the container by default.
  backgroundColor?: any;
  width?: string;
  height?: string;

  // Context theme API.
  theme?: {
    halftoneView: string;
  };
}


/******************* COMPONENT *******************/

class Halftone extends React.Component <Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      processing: false,
    };
  }

  public static defaultProps: Partial<Props> = {
    backgroundColor: "rgb(255, 255, 255)",
    width: "100%",
    height: "100%",
  };

  private handleStartProcessing = () => {
    console.log("START PROCESS");
    this.setState({
      ...this.state,
      processing: true,
    });
  }

  private handleStopProcessing = () => {
    console.log("STOP PROCESS");
    this.setState({
      ...this.state,
      processing: false,
    });
  }

  public render() {
    const showProgress = this.state.processing;

    return (
      <div className={this.props.theme.halftoneView}>
        <WaitComponent />
        <SimulatorComponent imageUrl={this.props.imageUrl}
          resolution={this.props.resolution}
          layerStack={this.props.layerStack}
          backgroundColor={this.props.backgroundColor}
          width={this.props.width}
          height={this.props.height}
          onNotifyError={this.props.onNotifyError}
          onStartProcessing={this.handleStartProcessing}
          onStopProcessing={this.handleStopProcessing}
        />
      </div>
    );
  }
};
export const HalftoneComponent = themr(identifiers.halftone)(Halftone);
