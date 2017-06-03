/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { Switch } from "react-toolbox/lib/switch";

import { identifiers } from "../../../../identifiers";
import { ColorPickerComponent } from "../../../../components/colorPicker";


/******************* INTERFACE *******************/

interface Props {
  animated: boolean;

  // Context theme API.
  theme?: {
    container: string;
  };
}


/******************* COMPONENT *******************/

class BackgroundColorPicker extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  public render() {
    return(
      <div className={this.props.theme.container}>
        
      </div>
    );
  }
}
export const BackgroundColorPickerComponent = themr(identifiers.backgroundColorPicker)(BackgroundColorPicker);