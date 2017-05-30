/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { ProgressBar } from "react-toolbox/lib/progress_bar";

import { identifiers } from "../../../../identifiers";


/******************* INTERFACE *******************/

interface Props {
  // Context theme API.
  theme?: {
    progressBar: string;
  };
}


/******************* COMPONENT *******************/

class Progress extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  public render() {
    return(
     <ProgressBar className={this.props.theme.progressBar}
      type="circular" mode="indeterminate" multicolor />
    );
  }
}
export const ProgressBarComponent = themr(identifiers.progressBar)(ProgressBar);
