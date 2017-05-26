/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";

import { identifiers } from "../../identifiers";
import { LayerStack } from "../../models/layerModel";
import { LayerAdderComponent } from "./components/layerAdder";
import { LayerListComponent } from "./components/layerList";
import { LayerRenamerComponent } from "./components/layerRenamer";


/******************* INTERFACE *******************/

interface State {
  layerStack: LayerStack;

  // Layer name that fired up actions like delete or rename.
  targetName: string;

  // ADD.
  adderNewName: string;

  // RENAME.
  renamerNewName: string;
  openRenameDialog: boolean;
}

interface Props {
  layerStack: LayerStack;
  maxNumLayers: number;

  // Context theme API.
  theme?: {
    layerSetup: string;
  };
}


/******************* COMPONENT *******************/

class LayerSetup extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      layerStack: props.layerStack,
      targetName: "",
      adderNewName: "",
      renamerNewName: "",
      openRenameDialog: false,
    };
  }

  private handleAdd = (newLayerName: string): void => {
    // Fired by Add layer button.
    // TODO: Implementation
    console.log(`Add Layer: ${newLayerName}`);
  }

  private handleAdderNameChange = (newName: string) => {
    // Fired by add new layer text input. Change state to reflect
    // editing name.
    // TODO: Input validation (Layer names must be unique)
    this.setState({...this.state, adderNewName: newName} as State);
  }

  private handleClickRename = (targetItemName: string): void => {
    // Fired by Rename menu entry. Change state to open rename dialog.
    this.setState({
      ...this.state,
      targetName: targetItemName,
      renamerNewName: "",
      openRenameDialog: true,
    } as State);
  }

  private handleRenamerNameChange = (newName: string) => {
    // Fired by text input in rename dialog. Change state to reflect
    // new name.
    // TODO: Input validation (Layer names must be unique)
    this.setState({...this.state, renamerNewName: newName} as State);
  }

  private handleRename = (currentName: string, newName: string) => {
    // Fired by OK button in rename dialog.
    // TODO: Implementation
    console.log(`Rename: ${currentName} to ${newName}`);
    return true;
  }

  private handleCloseRenameDialog = () => {
    // Fired when rename dialog is closed. Reset renaming state.
    this.setState({
      ...this.state,
      targetName: "",
      renamerNewName: "",
      openRenameDialog: false,
    } as State);
  }

  private handleClickDelete = (targetItemName: string):void => {
    // Fired by Delete menu entry.
    // TODO: Implementation
    console.log(`Delete: ${targetItemName}`);
  }

  private validNumLayers = (): boolean => this.props.layerStack.length <= this.props.maxNumLayers;

  public render() {
    return(
      <div className={this.props.theme.layerSetup}>
        <LayerAdderComponent disabled={!this.validNumLayers}
          name={this.state.adderNewName}
          onNameChange={this.handleAdderNameChange}
          onAdd={this.handleAdd}
        />
        <LayerListComponent layerStack={this.props.layerStack}
          onClickRename={this.handleClickRename}
          onClickDelete={this.handleClickDelete}
        />        
        <LayerRenamerComponent
            oldName={this.state.targetName}
            newName={this.state.renamerNewName}
            openDialog={this.state.openRenameDialog}
            onNameChange={this.handleRenamerNameChange}
            onRename={this.handleRename}
            onCloseDialog={this.handleCloseRenameDialog}
        />
      </div>
    );
  }
}
export const LayerSetupComponent = themr(identifiers.layerSetup)(LayerSetup);
