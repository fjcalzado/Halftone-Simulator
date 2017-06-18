/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { Dialog } from "react-toolbox/lib/dialog";

import { identifiers } from "../../../../identifiers";


/******************* INTERFACE *******************/

interface Props {
  show: boolean;
  onClose: () => void;

  // Context theme API.
  theme?: {
    dialog: string;
  };
}


/******************* COMPONENT *******************/

class InfoDialog extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  private handleClose = () => {
    this.props.onClose();
  }

  public render() {
    return(
      <Dialog className={this.props.theme.dialog}
        title="Halftone Simulator"
        actions={[{label: "Ok", onClick: this.handleClose}]}
        onEscKeyDown={this.handleClose}
        onOverlayClick={this.handleClose}
        active={this.props.show}
      >
        <p>Halftone is a reprographic technique that simulates continuous tone imagery
          through the use of dots, varying its properties like size, shape or pattern,
          and thus generating a gradient-like effect.</p>
        <p>Where continuous tone imagery contains an infinite range of colors or greys,
          the halftone process reduces visual reproductions to an image that is printed
          with only one color of ink. This reproduction relies on a basic optical illusion:
          the tiny halftone dots are blended into smooth tones by the human eye.</p>
        <p>CMYK printing is the result of combining four halftone images, one per each ink,
          with dot grid patterns usually rotated from each other.</p>
        <br/>
        <p>This project was originally developed as a test to find out D3.js and SVG limits
          in terms of performance and responsiveness when heavily accessing the DOM (thousands of
          elements). Halftone based on dots rendered by D3.js served perfectly for that
          purpose. Finally, the idea growed till it became a full simulation web app made with
          React.</p>
      </Dialog>
    );
  }
}
export const InfoDialogComponent = themr(identifiers.infoDialog)(InfoDialog);

