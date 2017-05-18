import * as React from "react";
import IconButton from "material-ui/IconButton";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import DeleteIcon from "material-ui/svg-icons/action/delete";
import ModeEditIcon from "material-ui/svg-icons/editor/mode-edit";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import { ListItem } from "material-ui/List";

import { LayerParameters } from "../../../../models/layerModel";
import { LayerItemRenamerComponent } from "../layerItemRenamer";
const styles = require("./layerItem.theme.scss");

interface State {
  openRenamer: boolean;
}

interface Props {
  layerParams: LayerParameters;
  onItemDelete: (itemName: string) => boolean;
  onItemRename: (itemName: string, newName: string) => boolean;
}


export class LayerItemComponent extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      openRenamer: false,
    };
  }

  private handleRename = (event) => {
    this.setState({
      ...this.state,
      openRenamer: true,
    });
  }

  public render() {
    return(
      <div>
        <ListItem className={styles.layerItem}
          rightIconButton={this.buttonMenuElement}
          primaryText={this.props.layerParams.name}
        />
        {/*<LayerItemRenamerComponent name={this.props.layerParams.name}
          onRename={this.props.onItemRename}
          doOpen={this.state.openRenamer}
        />*/}
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
        onTouchTap={this.handleRename}>
        Rename
      </MenuItem>
      <MenuItem leftIcon={<DeleteIcon />}
        onTouchTap={(event) => this.props.onItemDelete(this.props.layerParams.name)}>
        Delete
      </MenuItem>
    </IconMenu>
  );
}






