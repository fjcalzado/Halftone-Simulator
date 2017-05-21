/******************* IMPORT *******************/
import * as React from "react";
import { ListItem } from "react-toolbox/lib/list";
import { IconMenu, MenuItem } from "react-toolbox/lib/menu";
import { Switch } from "react-toolbox/lib/switch";

import { LayerParameters } from "../../../../models/layerModel";

const styles = require("./layerItem.scss");


/******************* INTERFACE *******************/

interface Props {
  layerParams: LayerParameters;
  onClickRename: (targetItemName: string) => void;
  onClickDelete: (targetItemName: string) => void;
}


/******************* COMPONENT *******************/

export class LayerItemComponent extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  private handleClickRename = (event) => {
    this.props.onClickRename(this.props.layerParams.name);
  }

  private handleClickDelete = (event) => {
     this.props.onClickDelete(this.props.layerParams.name);
  }

  public render() {
    return(
        <ListItem className={styles.layerItem}
          caption={this.props.layerParams.name}
          rightActions={this.layerItemMenu}
        />
    );
  }

  // TODO: Model enable/disable toggle and layer property.
  // TODO: Think if it is better to show a menu or maybe just a delete button and
  // the rest of layer properties in a layer panel along with dot and grid panels.
  private layerItemMenu = ([
    <IconMenu key="first-action" icon="more_vert" position="topLeft" menuRipple>
      <Switch checked={true} label={"Enable"}/>
      <MenuItem icon="mode_edit" caption="Rename" onClick={this.handleClickRename}/>
      <MenuItem icon="delete" caption="Delete" onClick={this.handleClickDelete}/>
    </IconMenu>,
  ]);
}






