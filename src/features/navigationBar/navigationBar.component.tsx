/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { AppBar } from "react-toolbox/lib/app_bar";
import { Navigation } from "react-toolbox/lib/navigation";
import { Link } from "react-toolbox/lib/link";

import { identifiers } from "../../identifiers";
const githubIcon = require("./GitHub_Icon.svg");


/******************* INTERFACE *******************/

interface Props {
  // Context theme API.
  theme?: {
    bar: string;
  };
}


/******************* COMPONENT *******************/

class NavigationBar extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  public render() {
    return(
      <AppBar className={this.props.theme.bar}
        title="Halftone Simulator" leftIcon="menu" rightIcon={<img src={githubIcon} />}>
        <Navigation type="horizontal">
          <Link href="http://" label="Inbox" icon="inbox" />
          <Link href="http://" active label="Profile" icon="person" />
        </Navigation>
      </AppBar>
    );
  }
}
export const NavigationBarComponent = themr(identifiers.navigationBar)(NavigationBar);

