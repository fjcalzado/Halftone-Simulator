/******************* IMPORT *******************/
import * as React from "react";
import { Button } from "react-toolbox/lib/button";
import { Input } from "react-toolbox/lib/input";
import { Dialog } from "react-toolbox/lib/dialog";

const styles = require("./layerItemRenamer.scss");


/******************* INTERFACE *******************/

interface Props {
  oldName: string;
  newName: string;
  openDialog: boolean;
  onNameChange: (newName: string) => void;
  onRename: (currentName: string, newName: string) => boolean;
  onCloseDialog: () => void;
}


/******************* COMPONENT *******************/

export class LayerItemRenamerComponent extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  private handleClickRename = (event) => {
    if (this.props.onRename(this.props.oldName, this.props.newName)) {
      this.props.onCloseDialog();
    }
  }

  private handleClickCancel = (event) => {
    this.props.onCloseDialog();
  }

  private handleNameChange = (event, newValue: string) => {
    this.props.onNameChange(newValue);
  }

  public render() {
    return(
      <Dialog className={styles.layerItemRenamer}
        title="Rename Layer"
        actions={this.dialogActions}
        onEscKeyDown={this.handleClickCancel}
        onOverlayClick={this.handleClickCancel}
        active={this.props.openDialog}
      >
        <Input
          type="text"
          name="layer_name"
          label={this.props.oldName}
          value={this.props.newName}
          onChange={this.handleNameChange.bind(this, "layer_name")}
          maxLength={20}
        />
      </Dialog>
    );
  }

  private dialogActions = [
      {label: "Cancel", onClick: this.handleClickCancel},
      {label: "Ok", onClick: this.handleClickRename},
    ];
}
