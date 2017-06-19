/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { Navigation } from "react-toolbox/lib/navigation";
import { Link } from "react-toolbox/lib/link";
import { RadioGroup, RadioButton } from "react-toolbox/lib/radio";

import { identifiers } from "../../../../identifiers";


/******************* INTERFACE *******************/

interface Props {
  userTheme: string;
  onUserThemeChange: (userTheme: string) => void;
  toolPanelPosition: string;
  onToolPanelPositionChange: (position: string) => void;
  onInfoClick: () => void;

  // Context theme API.
  theme?: {
    container: string;
    navigationContent: string;
    navigationSettings: string;
    toolPanelSettings: string;
  };
}


/******************* COMPONENT *******************/

class NavigationContent extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  public render() {
    return(
      <Navigation className={this.props.theme.navigationContent}
        type="vertical"
      >
        <div className={this.props.theme.toolPanelSettings}>
          <Link active href="#" label="Tool Panel Position" icon="view_array" />
          <RadioGroup className={this.props.theme.navigationSettings}
            name="toolPanelPosition" value={this.props.toolPanelPosition}
            onChange={this.props.onToolPanelPositionChange}
          >
            <RadioButton label="Left" value="left"/>
            <RadioButton label="Right" value="right" />
          </RadioGroup>
        </div>

        <Link active href="#" label="Theme" icon="palette" />
        <RadioGroup className={this.props.theme.navigationSettings}
          name="userTheme" value={this.props.userTheme}
          onChange={this.props.onUserThemeChange}
        >
          <RadioButton label="Light" value="light"/>
          <RadioButton label="Dark" value="dark" />
        </RadioGroup>

        <Link href="#" label="Info" icon="info" onClick={this.props.onInfoClick} />

        <Link href="mailto:fjcalzadosp@gmail.com?Subject=Halftone" label="Contact" icon="person" />
      </Navigation>
    );
  }
}
export const NavigationContentComponent = themr(identifiers.navigationContent)(NavigationContent);

