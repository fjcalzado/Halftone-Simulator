/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";

import { identifiers } from "../../../../identifiers";
import { rgbMatrix } from "./imaging";
import { LayerStack } from "../../../../models/layerModel";
import * as appChart from "./charting";
import { logDebug } from "../../../../util";


/******************* INTERFACE *******************/

interface Props {
  imageUrl: string;
  resolution: number;
  layerStack: LayerStack;
  onStartProcessing: () => void;
  onStopProcessing: () => void;
  onNotifyError?: (error: string) => void;

  // Optionals.
  // Background color. White by default.
  // Size. Fit the container by default.
  backgroundColor?: any;
  width?: string;
  height?: string;

  // Context theme API.
  theme?: {
    simulatorView: string;
  };
}


/******************* COMPONENT *******************/

class SimulatorNativeDOM extends React.Component <Props, {}> {
  constructor(props) {
    super(props);
  }

  // Lifecycle: Initialization Phase. After Mounting.
  // (Once the component is created and inserted into the DOM).
  public componentDidMount() {
    this.drawComplete(this.props);
  }

  // Lifecycle: Props/State changes. After receiving a prop change.
  // (Only called on re-rendering, not on initial render).
  // Lets use it to control props changes once the component has been mounted.
  public componentWillReceiveProps(nextProps) {
    // Control props changes once the component has been mounted.
    if ((nextProps.width !== this.props.width) || (nextProps.height !== this.props.height)) {
      this.drawComplete(nextProps);
      return;
    }

    if ((nextProps.imageUrl !== this.props.imageUrl) || (nextProps.resolution !== this.props.resolution) ) {
      this.setImage(nextProps);
      this.setBackground(nextProps);
      return;
    }

    if (nextProps.layerStack !== this.props.layerStack) {
      this.drawLayers(nextProps);
    }

    if (nextProps.backgroundColor !== this.props.backgroundColor) {
      this.setBackground(nextProps);
    }
  }

  // Lifecycle: State Changes. Before render method.
  // (Used to determine if a re-render is needed or can be skipped). 
  public shouldComponentUpdate() {
    // This prevents future re-renders of this component.
    return false;
  }

  private handleNotifyError = (error: string) => {
    this.props.onStopProcessing();
    logDebug(`[ERROR] Halftone Simulator Component: ${error}`);
    this.props.onNotifyError(error);
  }

  private drawComplete = (props: Props) => {
    this.initializeChart(props);
    this.setImage(props);
    this.setBackground(props);
  }

  private initializeChart = (props: Props) => {
    appChart.initialize("#simulator", props.width, props.height);
  }

  private setImage = (props: Props) => {
    this.props.onStartProcessing();
    rgbMatrix.getMatrix(props.imageUrl, props.resolution)
      .then((imgMatrix) => {
        appChart.setImage(imgMatrix);
        this.drawLayers(props);
      })
      .catch((error) => this.handleNotifyError(error));
  }

  private drawLayers = (props: Props) => {
    this.props.onStartProcessing();
    // WARNING: This is a heavy processing operation implemented
    // with Promises and not Web Workers due to DOM Access need.
    // Timeout intended to avoid freezing main thread for just
    // allowing React to render the 'rendering' component.
    setTimeout(() => {
      appChart.draw(props.layerStack)
      .then((ok) => this.props.onStopProcessing())
      .catch((error) => this.handleNotifyError(error));
    }, 100);
  }

  private setBackground = (props: Props) => {
    appChart.setBackgroundColor(props.backgroundColor);
  }

  public render() {
    return (
      <div className={this.props.theme.simulatorView} id="simulator" >
      </div>
    );
  }
};
export const SimulatorNativeDOMComponent = themr(identifiers.simulator)(SimulatorNativeDOM);
