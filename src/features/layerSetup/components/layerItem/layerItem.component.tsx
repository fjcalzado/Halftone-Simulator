/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { ListItem } from "react-toolbox/lib/list";
import { IconMenu, MenuItem } from "react-toolbox/lib/menu";
import { Switch } from "react-toolbox/lib/switch";

import { identifiers } from "../../../../identifiers";
import { LayerParameters } from "../../../../models/layerModel";


/******************* INTERFACE *******************/

interface Props {
  layerParams: LayerParameters;
  onClickRename: (targetItemName: string) => void;
  onClickDelete: (targetItemName: string) => void;
  onSelectLayer: (targetItemName: string) => void;

  // Context theme API.
  theme?: {
    item: string;
  };
}


/******************* COMPONENT *******************/

class LayerItem extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  private handleClickRename = (event) => {
    this.props.onClickRename(this.props.layerParams.name);
  }

  private handleClickDelete = (event) => {
     this.props.onClickDelete(this.props.layerParams.name);
  }

  private handleSelectLayer = (event) => {
     this.props.onSelectLayer(this.props.layerParams.name);
  }

  public render() {
    return(
        <ListItem className={this.props.theme.item}
          caption={this.props.layerParams.name}
          rightActions={this.layerItemMenu}
          onClick={this.handleSelectLayer}
          selectable={true}
        />
    );
  }

  // TODO: Model enable/disable toggle and layer property.
  // TODO: Think if it is better to show a menu or maybe just a delete button and
  // the rest of layer properties in a layer panel along with dot and grid panels.
  private layerItemMenu = ([
    <IconMenu key="first-action" icon="more_vert" position="topLeft" menuRipple>
      <MenuItem icon="mode_edit" caption="Rename" onClick={this.handleClickRename}/>
      <MenuItem icon="delete" caption="Delete" onClick={this.handleClickDelete}/>
    </IconMenu>,
  ]);
}
export const LayerItemComponent = themr(identifiers.layerItem)(LayerItem);





