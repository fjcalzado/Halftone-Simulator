import * as React from "react";
import { themr } from "react-css-themr";

interface Props {
  fakeProperty: boolean;
  theme?: any;
}


class IntroComponentInner extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  };

  public whatevermethod() {
    console.log("yeah");
  }

  public render() {
    return (
      <div className={this.props.theme.redtext}>
        <h1>Halftone Simulator</h1>
        <p>This is an example of D3.js usage to render a simulation of halftone printing patterns.</p>
        <p>Halftone is a reprographic technique that simulates continuous tone imagery through the 
          use of dots, varying its properties like size, shape or pattern.</p>
      </div>
    );
  };
};
export const IntroComponent = themr("CMPIntroMock")(IntroComponentInner);

