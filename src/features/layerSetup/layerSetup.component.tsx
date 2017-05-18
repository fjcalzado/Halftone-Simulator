import * as React from "react";

import { LayerStack } from "../../models/layerModel";
import { LayerListComponent } from "./components/layerList";


interface Props {
  layerStack: LayerStack;
}

/**
 * Layer Setup Component.
 */
export class LayerSetupComponent extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  public render() {
    return(
      <LayerListComponent layerStack={this.props.layerStack}
        onItemDelete={/*TODO*/ (itemName: string) => { console.log(`Delete:${itemName}`); return true;}}
        onItemRename={/*TODO*/ (itemName: string, newName: string) => {console.log(`Rename:${itemName}->${newName}`); return true;}} />
    );
  }

}