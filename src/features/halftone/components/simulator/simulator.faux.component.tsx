/******************* IMPORT *******************/
import * as React from "react";
import * as ReactFauxDOM from "react-faux-dom";
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
  backgroundColor: any;
  customBackgroundColor: boolean;
  onStartProcessing: () => void;
  onStopProcessing: () => void;
  onNotifyError?: (error: string) => void;

  // Optionals.
  // Size. Fit the container by default.
  width?: string;
  height?: string;

  // Context theme API.
  theme?: {
    simulatorView: string;
  };
}

interface State {
  chart: any;
}


/******************* COMPONENT *******************/

class SimulatorFauxDOM extends React.Component <Props, State> {
  constructor(props) {
    super(props);

    // Initialize default state.
    this.state = {
      chart: "",
    };
  }

  // Lifecycle: Initialization Phase. After Mounting.
  // (Once the component is created and inserted into the DOM).
  public componentDidMount() {
    // Call D3 to render within our faux node.
    this.renderD3(this.props);
  }

  // Lifecycle: Props/State changes. After receiving a prop change.
  // (Only called on re-rendering, not on initial render).
  // Lets use it to control props changes once the component has been mounted.
  public componentDidUpdate(prevProps, prevState) {
    if ((prevProps.width !== this.props.width) ||
        (prevProps.height !== this.props.height) ||
        (prevProps.imageUrl !== this.props.imageUrl) ||
        (prevProps.resolution !== this.props.resolution) ||
        (prevProps.layerStack !== this.props.layerStack) ||
        (prevProps.backgroundColor !== this.props.backgroundColor) ||
        (prevProps.customBackgroundColor !== this.props.customBackgroundColor)) {
      this.renderD3(this.props);
    }
  }

  private handleNotifyError = (error: string) => {
    logDebug(`[ERROR] Halftone Simulator Component: ${error}`);
    this.props.onNotifyError(error);
  }

  private renderD3 = (props: Props) => {
    this.props.onStartProcessing();

    // Initialize faux node.
    const fauxNode = ReactFauxDOM.createElement("div");
    fauxNode.setAttribute("class", `virtualNode ${this.props.theme.simulatorView}`);

    // Initialize Chart and set Background color.
    appChart.initialize(fauxNode, props.width, props.height);
    appChart.setBackgroundColor(props.customBackgroundColor, props.backgroundColor);

    // Extract image matrix and set it.
    rgbMatrix.getMatrix(props.imageUrl, props.resolution)
      .then((imgMatrix) => {
        // Set Image Matrix.
        appChart.setImage(imgMatrix);

        // Finally, we are ready to render.
        // WARNING: This is a heavy processing operation implemented
        // with Promises and not Web Workers due to DOM Access need.
        // Timeout intended to avoid freezing main thread for just
        // allowing React to render the 'rendering' component.
        setTimeout(() => {
          appChart.draw(props.layerStack)
          .then((ok) => {
            this.setState({
              chart: fauxNode.toReact(),
            });
            this.props.onStopProcessing();
          })
          .catch((error) => {throw error; });
        }, 100);
      })
      .catch((error) => {
        this.props.onStopProcessing();
        this.handleNotifyError(error);
      });
  }

  public render() {
    return (
      <div className={`connectorNode ${this.props.theme.simulatorView}`}>        
        {this.state.chart}
      </div>
    );
  }
};
export const SimulatorFauxDOMComponent = themr(identifiers.simulator)(SimulatorFauxDOM);
