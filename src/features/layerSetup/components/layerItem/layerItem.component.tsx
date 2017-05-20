/******************* IMPORT *******************/
import * as React from "react";
import { ListItem } from "react-toolbox/lib/list";
import { IconMenu, MenuItem, MenuDivider } from "react-toolbox/lib/menu";

import { LayerParameters } from "../../../../models/layerModel";

const styles = require("./layerItem.scss");


/******************* INTERFACE *******************/

interface Props {
  layerParams: LayerParameters;
  onTouchTapRename: (targetItemName: string) => void;
  onTouchTapDelete: (targetItemName: string) => void;
}


/******************* COMPONENT *******************/

export class LayerItemComponent extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  private handletouchTapRename = (event) => {
    this.props.onTouchTapRename(this.props.layerParams.name);
  }

  private handleTouchTapDelete = (event) => {
     this.props.onTouchTapDelete(this.props.layerParams.name);
  }

  public render() {
    return(
        <ListItem className={styles.layerItem}
          caption={this.props.layerParams.name}
          rightActions={[this.layerItemMenu]}
        />
    );
  }

  private layerItemMenu = (
    <IconMenu key="first-action" icon="more_vert" position="topLeft" menuRipple>
      {/*<MenuItem icon="get_app" caption="Download" />
      <MenuDivider />
      <MenuItem icon="delete" caption="Delete" />*/}
  </IconMenu>
  );

  // Split the render markup into more readable subcomponents.

  // 1. This element represents the button on the right.
  /*private buttonElement = (
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
  private buttonMenuElement = (
    <IconMenu iconButtonElement={this.buttonElement}>
      <MenuItem leftIcon={<ModeEditIcon />}
        onTouchTap={this.handletouchTapRename}>
        Rename
      </MenuItem>
      <MenuItem leftIcon={<DeleteIcon />}
        onTouchTap={this.handleTouchTapDelete}>
        Delete
      </MenuItem>
    </IconMenu>
  );*/
}






