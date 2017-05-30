/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";

import { identifiers } from "../../../../identifiers";
import { rgbMatrix } from "../../imaging";
import { LayerStack } from "../../../../models/layerModel";
import * as appChart from "../../charting";
import { logDebug } from "../../../../util";

/**
 * D3 handles the DOM natively while React do it virtually.
 * A React component does not expect anybody mutating the
 * DOM outside the render method, which will be the case
 * with a D3 embedded into React. Thus, React will ignore
 * any D3 changes to DOM on each re-render and will follow
 * what the render methods says. We wont see any D3 work in
 * our chart embedded into React.
 * There are several approach to overcome this issue:
 *
 *  - Let React take care of DOM manipulation while D3 is used
 *  only for maths. This must be crafted carefully and requires
 *  a bit of work.
 *    PROS: React virtual DOM performance.
 *    CONS: We loose some D3 features, mainly animations.
 *    Usage: Only for complex charts where we can benefit from
 *           React DOM performance with no animations involved.
 *
 *  - Faux React DOM: a third party library to create a fake DOM
 *  to be manipulated by D3 and then transformed to a React render
 *  phase.
 *    PROS: Cool approach, D3 native code, transparent.
 *    CONS: Not mature enough (as of April 2017).
 *    Usage: Not considered so far.
 *
 *  - Keep React out of the game when necessary. Lets just use React
 *  to render the component root element where our chart will be
 *  attached to while D3 will handle the rest of the DOM from that point
 *  downwards.
 *    PROS: Very easy approach, few lines of code. Native D3 code.
 *    CONS: We have left React of game from the component root element
 *    which means that no React component can be attached as children in
 *    a native way. We can manually control a children React component render
 *    process though.
 *    Usage: as it retains full D3 functionality and it is very easy to
 *           implement, we have picked up this solution.
 */

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

class Simulator extends React.Component <Props, {}> {
  constructor(props) {
    super(props);
  }

  // Lifecycle: Initialization Phase. After Mounting.
  // (Once the component is created and inserted into the DOM).
  public componentDidMount() {
    this.drawComplete(this.props);
  }

  // Lifecycle: Props changes. Before receiving a prop change.
  // (Only called on re-rendering, not on initial render).
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
    this.setBackground(props.backgroundColor);
  }

  private initializeChart = (props: Props) => {
    appChart.initialize("simulator", props.width, props.height);
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
    appChart.draw(props.layerStack)
      .then((ok) => this.props.onStopProcessing())
      .catch((error) => this.handleNotifyError(error));
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
export const SimulatorComponent = themr(identifiers.simulator)(Simulator);
