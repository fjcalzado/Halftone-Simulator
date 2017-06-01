/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { ProgressBar } from "react-toolbox/lib/progress_bar";

import { identifiers } from "../../../../identifiers";


/******************* INTERFACE *******************/

interface Props {
  // Context theme API.
  theme?: {
    wait: string;
  };
}


/******************* COMPONENT *******************/

class Wait extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  public render() {
    return(
      <div className={this.props.theme.wait}>
        <ProgressBar 
        type="circular" mode="indeterminate" multicolor /> 
      </div>
    );
  }
}
export const WaitComponent = themr(identifiers.wait)(Wait);
