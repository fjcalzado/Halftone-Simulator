/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";

import { identifiers } from "../../identifiers";
import { LayerStack } from "../../models/layerModel";
import { SimulatorNativeDOMComponent } from "./components/simulator";
import { WaitComponent } from "./components/wait";
import { logDebug } from "../../util/log";


/******************* INTERFACE *******************/

interface State {
  processing: boolean;
}

interface Props {
  imageUrl: string;
  resolution: number;
  layerStack: LayerStack;
  onNotifyError?: (error: string) => void;
  customBackgroundColor: boolean;
  backgroundColor: any;

  // Optionals.
  // Size. Fit the container by default.
  width?: string;
  height?: string;

  // Context theme API.;
  theme?: {
    halftoneView: string;
    simulatorView: string;
  };
}


/******************* COMPONENT *******************/

class Halftone extends React.Component <Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      processing: true,
    };
  }

  public static defaultProps: Partial<Props> = {
    backgroundColor: "rgb(255, 255, 255)",
    width: "100%",
    height: "100%",
  };

  private handleStartProcessing = () => {
    logDebug("[START RENDERING]");
    this.setState({
      ...this.state,
      processing: true,
    });
  }

  private handleStopProcessing = () => {
    logDebug("[STOP RENDERING]");
    this.setState({
      ...this.state,
      processing: false,
    });
  }

  public render() {
    const showProgress = this.state.processing;

    return (
      <div className={this.props.theme.halftoneView}>
        {showProgress ? <WaitComponent /> : null }
        <SimulatorNativeDOMComponent
          imageUrl={this.props.imageUrl}
          resolution={this.props.resolution}
          layerStack={this.props.layerStack}
          backgroundColor={this.props.backgroundColor}
          customBackgroundColor={this.props.customBackgroundColor}
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
