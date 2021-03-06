/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { ListItem } from "react-toolbox/lib/list";
import { IconMenu, MenuItem } from "react-toolbox/lib/menu";
import { Switch } from "react-toolbox/lib/switch";
import { FontIcon } from "react-toolbox/lib/font_icon";
import { SortableHandle } from "react-sortable-hoc";

import { identifiers } from "../../../../identifiers";
import { LayerParameters } from "../../../../models/layerModel";


/******************* INTERFACE *******************/

interface Props {
  layerParams: LayerParameters;
  onClickRename: (targetItemName: string) => void;
  onClickDelete: (targetItemName: string) => void;
  selected: boolean;
  onSelectLayer: (targetItemName: string) => void;

  // Context theme API.
  theme?: {
    layerItem: string;
    selected: string;
    dragHandle: string;
    rightMenu: string;
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
        <ListItem className={`${this.props.theme.layerItem}
            ${this.props.selected ? this.props.theme.selected : ""}`}
          leftIcon={<this.DragHandle key="drag-handle"/>}
          caption={this.props.layerParams.name}
          rightActions={this.layerItemMenu}
          onClick={this.handleSelectLayer}
          selectable={true}
        />
    );
  }

  private layerItemMenu = ([
    <IconMenu className={this.props.theme.rightMenu}
      key="first-action" icon="more_horiz" position="topRight" menuRipple
    >
      <MenuItem icon="mode_edit" caption="Rename" onClick={this.handleClickRename}/>
      <MenuItem icon="delete" caption="Delete" onClick={this.handleClickDelete}/>
    </IconMenu>,
  ]);

  private DragHandle = SortableHandle(() => {
    return (
      <FontIcon className={this.props.theme.dragHandle}
                value="reorder" />
    );
  });
}
export const LayerItemComponent = themr(identifiers.layerItem)(LayerItem);
