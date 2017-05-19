import * as React from "react";

import { LayerStack } from "../../models/layerModel";
import { LayerListComponent } from "./components/layerList";
import { LayerItemRenamerComponent } from "./components/layerItemRenamer";
const styles = require("./layerSetup.theme.scss");


interface State {
  layerStack: LayerStack;
  
  // Layer name that fired up actions like delete or rename.
  targetName: string;

  // Renaming.
  newName: string;
  openRenameDialog: boolean;  
}

interface Props {
  layerStack: LayerStack;
}


/**
 * Layer Setup Component.
 */
export class LayerSetupComponent extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      layerStack: props.layerStack,
      targetName: "",
      newName: "",
      openRenameDialog: false,      
    };
  }

  private handletouchTapRename = (targetItemName: string):void => {
    // Fired by Rename menu entry. Change state to open rename dialog.
    this.setState({
      ...this.state,
      targetName: targetItemName,
      newName: "",
      openRenameDialog: true,      
    } as State);
  }

  private handleNameChange = (newName: string) => {
    // Fired by text input in rename dialog. Change state to reflect
    // new name.
    this.setState({...this.state, newName} as State);
  }

  private handleRename = (currentName: string, newName: string) => {
    // Fired by OK button in rename dialog.
    // *TODO*
    console.log(`Rename: ${currentName} to ${newName}`);
    return true;
  }

  private handleCloseRenameDialog = () => {
    // Fired when rename dialog is closed. Reset renaming state.
    this.setState({
      ...this.state,
      targetName: "",
      newName: "",
      openRenameDialog: false,
    } as State);
  }

  private handleTouchTapDelete = (targetItemName: string):void => {
    // Fired by Delete menu entry.
    // *TODO*
    console.log(`Delete: ${targetItemName}`);
  }

  public render() {
    return(
      <div className={styles.layerSetup}>
        <LayerListComponent layerStack={this.props.layerStack}
          onTouchTapRename={this.handletouchTapRename}
          onTouchTapDelete={this.handleTouchTapDelete}
        />        
        <LayerItemRenamerComponent 
            oldName={this.state.targetName}
            newName={this.state.newName}
            openDialog={this.state.openRenameDialog}
            onNameChange={this.handleNameChange}
            onRename={this.handleRename}  
            onCloseDialog={this.handleCloseRenameDialog}          
        />
      </div>
    );
  }
}