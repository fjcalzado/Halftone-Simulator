/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { AppBar } from "react-toolbox/lib/app_bar";
import { Navigation } from "react-toolbox/lib/navigation";
import { Link } from "react-toolbox/lib/link";
import { FontIcon } from "react-toolbox";
import { Drawer } from "react-toolbox/lib/drawer";

import { identifiers } from "../../identifiers";
import { localFileReader } from "../../rest-api/localFileReader";
import { GithubIcon } from "./github.icon";
import { InfoDialogComponent } from "./components/infoDialog";

/******************* INTERFACE *******************/

interface Props {
  // Context theme API.
  theme?: {
    container: string;
    bar: string;
    navigationGroup: string;
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
      <div className={this.props.theme.container}>
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
          {this.navigationLinks}
        </Drawer>
      </div>
    );
  }

  // TODO. Move apart to another file.
  private navigationLinks = (
    <Navigation className={this.props.theme.navigationGroup}
      type="vertical"
    >
      <Link href="#" label="Info" icon="info" onClick={this.handleGenericStateChange.bind(this, "showInfo", true)} />
      <Link href="mailto:fjcalzadosp@gmail.com?Subject=Halftone" label="Contact" icon="person" />
    </Navigation>
  );
}
export const NavigationBarComponent = themr(identifiers.navigationBar)(NavigationBar);

