/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { AppBar } from "react-toolbox/lib/app_bar";

import { Drawer } from "react-toolbox/lib/drawer";

import { identifiers } from "../../identifiers";
import { localFileReader } from "../../rest-api/localFileReader";
import { GithubIcon } from "./github.icon";
import { InfoDialogComponent } from "./components/infoDialog";
import { NavigationContentComponent } from "./components/navigationContent";

/******************* INTERFACE *******************/

interface Props {
  userTheme: string;
  onUserThemeChange: (userTheme: string) => void;
  toolPanelPosition: string;
  onToolPanelPositionChange: (position: string) => void;

  // Add class name from parent.
  className?: string;

  // Context theme API.
  theme?: {
    container: string;
    bar: string;
    drawer: string;
  };
}

interface State {
  showInfo: boolean;
  showDrawer: boolean;
}


/******************* COMPONENT *******************/

class NavigationBar extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      showInfo: false,
      showDrawer: false,
    };
  }

  private handleRightIconClick = (event) => {
    window.open("https://github.com/fjcalzado/Halftone-Simulator");
  }

  private handleGenericStateChange = (field, value) => {
    this.setState({
      ...this.state,
      [field]: value,
    });
  }

  public render() {
    return(
      <div className={`${this.props.className || ""} ${this.props.theme.container || ""}`.trim()}>
        <AppBar className={this.props.theme.bar}
          title="Halftone Simulator"
          leftIcon="menu"
          onLeftIconClick={this.handleGenericStateChange.bind(this, "showDrawer", true)}
          rightIcon={GithubIcon()}
          onRightIconClick={this.handleRightIconClick}
        >
        </AppBar>
        <InfoDialogComponent show={this.state.showInfo}
          onClose={this.handleGenericStateChange.bind(this, "showInfo", false)}
        />
        <Drawer className={this.props.theme.drawer}
          active={this.state.showDrawer}
          onOverlayClick={this.handleGenericStateChange.bind(this, "showDrawer", false)}
        >
          <NavigationContentComponent
            userTheme={this.props.userTheme}
            onUserThemeChange={this.props.onUserThemeChange}
            toolPanelPosition={this.props.toolPanelPosition}
            onToolPanelPositionChange={this.props.onToolPanelPositionChange}
            onInfoClick={this.handleGenericStateChange.bind(this, "showInfo", true)}
          />
        </Drawer>
      </div>
    );
  }
}
export const NavigationBarComponent = themr(identifiers.navigationBar)(NavigationBar);

