/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { Button } from "react-toolbox/lib/button";
import { Input } from "react-toolbox/lib/input";
import { Dialog } from "react-toolbox/lib/dialog";

import { identifiers } from "../../../../identifiers";


/******************* INTERFACE *******************/

interface Props {
  currentName: string;
  newName: string;
  openDialog: boolean;
  onNameChange: (editingName: string) => void;
  onRenameLayer: (currentName: string, newName: string) => boolean;
  onCloseDialog: () => void;
  error?: string;

  // Context theme API.
  theme?: {
    dialog: string;
  };
}


/******************* COMPONENT *******************/

class LayerRenamer extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  private handleClickRename = (event) => {
    if (this.props.onRenameLayer(this.props.currentName, this.props.newName)) {
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
      <Dialog className={this.props.theme.dialog}
        title="Rename Layer"
        actions={this.dialogActions()}
        onEscKeyDown={this.handleClickCancel}
        onOverlayClick={this.handleClickCancel}
        active={this.props.openDialog}
      >
        <Input
          type="text"
          name="renameLayer_name"
          label={this.props.currentName}
          value={this.props.newName}
          error={this.props.error}
          onChange={this.handleNameChange.bind(this, "renameLayer_name")}
          maxLength={20}
        />
      </Dialog>
    );
  }

  private okDisabled = () => {
    return Boolean(this.props.error) || !this.props.newName;
  }

  private dialogActions = () => [
    {label: "Cancel", onClick: this.handleClickCancel},
    {label: "Ok", onClick: this.handleClickRename, disabled: this.okDisabled()},
  ]
}
export const LayerRenamerComponent = themr(identifiers.layerRenamer)(LayerRenamer);
