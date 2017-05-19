import * as React from "react";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TextField from 'material-ui/TextField';

const styles = require("./layerItemRenamer.theme.scss");


interface Props {
  oldName: string;
  newName: string;
  openDialog: boolean;
  onNameChange: (newName: string) => void;
  onRename: (currentName: string, newName: string) => boolean;
  onCloseDialog: () => void;  
}


export class LayerItemRenamerComponent extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  private handleTouchTapRename = (event) => {
    if (this.props.onRename(this.props.oldName, this.props.newName)) {
      this.props.onCloseDialog();
    }
  }

  private handleTouchTapCancel = (event) => {
    this.props.onCloseDialog();
  }

  private handleNameChange = (event, newValue: string) => {
    this.props.onNameChange(newValue);
  }

  public render() {
    const dialogButtons = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleTouchTapCancel}
      />,
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleTouchTapRename}
      />,
    ];

    return(
      <Dialog className={styles.layerItemRenamer}
        title="Rename Layer"
        actions={dialogButtons}
        modal={true}
        open={this.props.openDialog}
      >
        <TextField
          floatingLabelText={this.props.oldName}
          value={this.props.newName}
          onChange={this.handleNameChange}
        />
      </Dialog>
    );
  }
}