import * as React from "react";
import IconButton from "material-ui/IconButton";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import DeleteIcon from "material-ui/svg-icons/action/delete";
import ModeEditIcon from "material-ui/svg-icons/editor/mode-edit";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import {grey400, cyanA400} from "material-ui/styles/colors";
import {ListItem} from "material-ui/List";

import { LayerParameters } from "../../../../models/layerModel";
const styles = require("./layerItem.theme.scss");


interface Props {
  layerParams: LayerParameters;
  onItemDelete?: (itemName: string) => void;
  onItemRename?: (itemName: string, newName: string) => void;
}


// Split the render markup into more readable subcomponents.

// 1. This element represents the button on the right.
const buttonElement = (
    <IconButton
      touch={true}
      tooltip="Layer Options"
      tooltipPosition="bottom-right"
    >
      <MoreVertIcon color={styles.rightButtonColor}
                    hoverColor={styles.rightButtonColorHover}
      />
    </IconButton>
  );

// 2. This element represents the clickable-through-button 
// context menu on the right.
const buttonMenuElement = (
    <IconMenu
      iconButtonElement={buttonElement}
    >
      <MenuItem leftIcon={<ModeEditIcon />}>
        Rename
      </MenuItem>
      <MenuItem leftIcon={<DeleteIcon />}>
        Delete
      </MenuItem>
    </IconMenu>
  );


export class LayerItemComponent extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  public render() {
    return(
      <ListItem className={styles.layerItem}
        rightIconButton={buttonMenuElement}
        primaryText={this.props.layerParams.name}
      />
    );
  }

}
