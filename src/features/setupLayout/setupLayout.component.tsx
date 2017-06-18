/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { Tab, Tabs } from "react-toolbox";

import { identifiers } from "../../identifiers";


/******************* INTERFACE *******************/

interface Props {
  tabsContent: Array<{title: string, icon: string, content: JSX.Element}>;

  // Context theme API.
  theme?: {
    container: string;
    tabs: string;
  };
}

interface State {
  tabIndex: number;
}

/******************* COMPONENT *******************/

class SetupLayout extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      tabIndex: 0,
    };
  }

  private handleTabChange = (newTab) => {
    this.setState({
      ...this.state,
      tabIndex: newTab,
    });
  }

  public render() {
    const tabItems = this.props.tabsContent.map((item, index) => (
      <Tab label={item.title} key={index} icon={item.icon} ripple={false}>
        {item.content}
      </Tab>
    ));

    return(
      <div className={this.props.theme.container}>
        <Tabs className={this.props.theme.tabs}
          index={this.state.tabIndex}
          onChange={this.handleTabChange}
          fixed
        >
          {tabItems}
        </Tabs>
      </div>
    );
  }
}
export const SetupLayoutComponent = themr(identifiers.setupLayout)(SetupLayout);

