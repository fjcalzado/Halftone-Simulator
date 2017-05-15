import * as React from "react";

import * as appChart from "./charting";
import { rgbMatrix } from "./imaging";
const styles = require("./halftoneTheme.scss");

import { GenerateSampleLayerStack } from "../../tmp-mocks/layerStackMock";

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

interface IProps {
  imageUrl: string;
  resolution?: number;
  // Optional Size. Fit the container by default.
  width?: string;
  height?: string;
}

interface IState {
}

/**
 * Halftone Simulator React Component.
 * Draw a picture using traditional halftone technique.
 * @public
 */
export class HalftoneComponent extends React.Component < IProps, {} > {
  constructor(props) {
    super(props);
    // Default initial state.
    const defaultState: IProps = {
      imageUrl: "",
      resolution: 1000,
      width: "100%",
      height: "100%",
    };
    this.state = defaultState;
  }

  public render() {
    return (
      <div className = {styles.container}>
      </div>
    );
  }

  // Lifecycle: Initialization Phase. After Mounting.
  // (Once the component is created and inserted into the DOM).
  private componentDidMount() {
    this.drawChart();
  }

  // Lifecycle: Props changes. Before receiving a prop change.
  // (Only called on re-rendering, not on initial render).
  private componentWillReceiveProps(nextProps) {
    // Control props changes once the component has been mounted.
  }

  // Lifecycle: State Changes. Before render method.
  // (Used to determine if a re-render is needed or can be skipped). 
  private shouldComponentUpdate() {
    // This prevents future re-renders of this component.
    return false;
  }

  private drawChart() {
    // Halftone pattern can be made of circular, elliptical or square shapes.
    // When using circular dots, these should meet (overlap) at a tonal value of 70%.
    // The proper channel to determine the dots size is HSL lightness.
    appChart.initialize(styles.container, this.props.width, this.props.height);
    rgbMatrix.getMatrix(this.props.imageUrl, this.props.resolution)
      .then((imgMatrix) => {
        appChart.setImage(imgMatrix);
        appChart.draw( GenerateSampleLayerStack(imgMatrix[0].length, imgMatrix.length) );
      })
      .catch((error) => console.error(`[ERROR] Halftone Simulator App: ${error}`));
  }

};

