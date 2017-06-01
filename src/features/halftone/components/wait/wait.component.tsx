/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { ProgressBar } from "react-toolbox/lib/progress_bar";

import { identifiers } from "../../../../identifiers";


/******************* INTERFACE *******************/

interface Props {
  animated: boolean;

  // Context theme API.
  theme?: {
    wait: string;
    waitOverlay: string;
    waitToken: string;
  };
}


/**
 * This component was intended to be an animated progress bar.
 * However, due the nature of the problem where the main thread
 * is gonna be processing heavy DOM modification from simulator
 * component (using D3.js), we will loose responsiveness in the
 * main thread. So it is better to stick with some static text.
 *
 * Ideally, this could be solved if we found the way to use web
 * workers accessing some kind of virtual DOM that could be
 * reconciliated with our main DOM afterwards.
 */

/******************* COMPONENT *******************/

class Wait extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  public render() {
    return(
      <div className={this.props.theme.wait}>
        <div className={this.props.theme.waitOverlay}>
          {this.props.animated ?
            <ProgressBar type="circular" mode="indeterminate" multicolor />
            : <p className={this.props.theme.waitToken}>Rendering</p> }
        </div>
      </div>
    );
  }
}
export const WaitComponent = themr(identifiers.wait)(Wait);
