/******************* IMPORT *******************/
import * as React from "react";

import { LayerParameters, LayerStack, CloneLayerParams } from "../../models/layerModel";
import { LayerSetupComponent } from "./layerSetup.component";
import * as layerUtil from "./layerSetup.utils";
import { logDebug } from "../../util/log";


/******************* INTERFACE *******************/

interface State {
  // External.
  layerStack: LayerStack;
  maxNumLayers: number;
  
  // Internal.
  selectedLayer: string;
  addLayerEditingName: string;
  addLayerErrorMessage: string;
  addLayerDisabled: false;
  renameLayerEditingName: string;
  renameLayerCurrentName: string;
  renameLayerErrorMessage: string;
}

interface Props {
  layerStack: LayerStack;
  maxNumLayers: number;
  onDrawLayersChange: (layerStack: LayerStack) => void;
}


/******************* COMPONENT *******************/

export class LayerSetupContainer extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      layerStack: layerUtil.cloneLayerStack(props.layerStack),
      maxNumLayers: props.maxNumLayers,
      selectedLayer: "",
      addLayerEditingName: "",
      addLayerErrorMessage: "",
      addLayerDisabled: false,
      renameLayerEditingName: "",
      renameLayerCurrentName: "",
      renameLayerErrorMessage: "",
    };
  }

  private handleDrawLayers = (event) => {
    this.props.onDrawLayersChange(this.state.layerStack);
  }

  private handleImportLayerStack = (newLayerStack: any) => {
    // Duck typing to ensure it is a layer stack.
    try {
      if (newLayerStack[0].hasOwnProperty("gridParams") && 
          newLayerStack[0].hasOwnProperty("dotParams")) {
        this.setState({
          ...this.state,
          layerStack: newLayerStack as LayerStack,
        } as State);
      } else {
        throw newLayerStack.toString();
      }   
    } catch (error) {
      logDebug(`[ERROR] Importing wrong layer stack: ${error}`)
    } 
  }

  private handleResetLayers = (event) => {
    // Reset state by cloning the received props layerStack into state.
    this.setState({
      ...this.state,
      layerStack: layerUtil.cloneLayerStack(this.props.layerStack),
      maxNumLayers: this.props.maxNumLayers,
    } as State);
  }

  private handleAddLayerNameChange = (editingName: string) => {
    // Fired by add new layer text input. Change state to reflect
    // editing name. Input must be validated.
    const trimmedName = editingName.trim();
    const validation = layerUtil.isLayerNameValid(this.state.layerStack, trimmedName);
    this.setState({
      ...this.state,
      addLayerEditingName: trimmedName,
      addLayerErrorMessage: validation.error,
    } as State);
  }

  private handleAddLayer = (newLayerName: string): void => {
    // Fired by Add layer button.
    this.setState({
      ...this.state,
      layerStack: layerUtil.addLayer(this.state.layerStack, newLayerName),
      addLayerEditingName: "",
    } as State);
  }

  private handleClickRenameLayer = (targetLayerName: string): void => {
    // Fired by Rename menu entry. Change state to open rename dialog.
    this.setState({
      ...this.state,
      renameLayerCurrentName: targetLayerName,
      renameLayerEditingName: "",
    } as State);
  }

  private handleRenameLayerNameChange = (editingName: string) => {
    // Fired by text input in rename dialog. Change state to reflect
    // new name.
    const trimmedName = editingName.trim();
    const validation = layerUtil.isLayerNameValid(this.state.layerStack, trimmedName);
    this.setState({
      ...this.state,
      renameLayerEditingName: trimmedName,
      renameLayerErrorMessage: validation.error,
    } as State);
  }

  private handleRenameLayer = (currentName: string, newName: string) => {
    // Fired by OK button in Rename dialog.
    const newls = layerUtil.renameLayer(this.state.layerStack, currentName, newName);
    this.setState({
      ...this.state,
      layerStack: layerUtil.renameLayer(this.state.layerStack, currentName, newName),
      renameLayerCurrentName: "",
      renameLayerEditingName: "",
    } as State);
  }

  private handleCloseRenameLayerDialog = () => {
    // Fired when Rename dialog is closed. Reset renaming state.
    this.setState({
      ...this.state,
      renameLayerCurrentName: "",
      renameLayerEditingName: "",
    } as State);
  }

  private handleDeleteLayer = (targetLayerName: string): void => {
    // Fired by Delete menu entry.
    this.setState({
      ...this.state,
      layerStack: layerUtil.removeLayer(this.state.layerStack, targetLayerName),
    } as State);
  }

  private handleSortList = (oldIndex: number, newIndex: number): void => {
    // Fired on drag and drop sorting.
    this.setState({
      ...this.state,
      layerStack: layerUtil.sortLayer(this.state.layerStack, oldIndex, newIndex),
    } as State);
  }

  private handleSelectLayer = (targetLayerName: string): void => {
    // Fired on click on layer item. Lets simulate a toggle. If layer was already
    // selected, just unselect it. 
    this.setState({
      ...this.state,
      selectedLayer: this.state.selectedLayer === targetLayerName ? "" : targetLayerName,
    } as State);
  }

  private handleSelectedLayerParamsChanged = (lp: LayerParameters): void => {
    // Fired whenever a change is done in any parameter from LayerParams component.
    this.setState({
      ...this.state,
      layerStack: layerUtil.replaceLayerParams(this.state.layerStack, this.state.selectedLayer, lp),
    } as State);
  }

  private exceedNumLayers = (): boolean => this.state.layerStack.length >= this.state.maxNumLayers;

  public componentWillReceiveProps(nextProps) {
    // Update state by cloning the received layerStack into state.
    this.setState({
      ...this.state,
      layerStack: layerUtil.cloneLayerStack(nextProps.layerStack),
      maxNumLayers: nextProps.maxNumLayers,
    } as State);
  }

  public render() {

    // Resolve variables from current state that can be done on the fly.
    const addErrorMsg = this.exceedNumLayers() ? `Max layers reached (${this.props.maxNumLayers})`
      : this.state.addLayerErrorMessage;
    const addDisabled = this.exceedNumLayers() || this.state.addLayerDisabled;

    return(
      <LayerSetupComponent layerStack={this.state.layerStack}
        onImportLayerStack={this.handleImportLayerStack}
        onClickDrawLayers={this.handleDrawLayers}
        onClickResetLayers={this.handleResetLayers}
        addLayerDisabled={addDisabled}
        onAddLayerNameChange={this.handleAddLayerNameChange}
        onAddLayer={this.handleAddLayer}
        addLayerEditingName={this.state.addLayerEditingName}
        addLayerErrorMessage={addErrorMsg}
        onClickRenameLayer={this.handleClickRenameLayer}
        onRenameLayerNameChange={this.handleRenameLayerNameChange}
        onRenameLayer={this.handleRenameLayer}
        onCloseRenameLayerDialog={this.handleCloseRenameLayerDialog}
        renameLayerEditingName={this.state.renameLayerEditingName}
        renameLayerCurrentName={this.state.renameLayerCurrentName}
        renameLayerErrorMessage={this.state.renameLayerErrorMessage}
        onDeleteLayer={this.handleDeleteLayer}
        onSortList={this.handleSortList}
        onSelectLayer={this.handleSelectLayer}
        selectedLayer={this.state.selectedLayer}
        onSelectedLayerParamsChanged={this.handleSelectedLayerParamsChanged}
      />
    );
  }
}
