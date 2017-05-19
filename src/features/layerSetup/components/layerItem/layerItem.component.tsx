import * as React from "react";
import IconButton from "material-ui/IconButton";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import DeleteIcon from "material-ui/svg-icons/action/delete";
import ModeEditIcon from "material-ui/svg-icons/editor/mode-edit";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import { ListItem } from "material-ui/List";

import { LayerParameters } from "../../../../models/layerModel";

const styles = require("./layerItem.theme.scss");


interface Props {
  layerParams: LayerParameters;
  onTouchTapRename: (targetItemName: string) => void;
  onTouchTapDelete: (targetItemName: string) => void;  
}


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
      <div>
        <ListItem className={styles.layerItem}
          rightIconButton={this.buttonMenuElement}
          primaryText={this.props.layerParams.name}
        />
       
      </div>
    );
  }



  // Split the render markup into more readable subcomponents.

  // 1. This element represents the button on the right.
  private buttonElement = (
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
  );
}






