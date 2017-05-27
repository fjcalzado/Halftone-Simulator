/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";

import { identifiers } from "../../identifiers";
import { LayerStack } from "../../models/layerModel";
import { LayerAdderComponent } from "./components/layerAdder";
import { LayerListComponent } from "./components/layerList";
import { LayerRenamerComponent } from "./components/layerRenamer";


/******************* INTERFACE *******************/

interface Props {
  layerStack: LayerStack;

  addLayerDisabled: boolean;
  onAddLayerNameChange: (editingName: string) => void;
  onAddLayer: (newLayerName: string) => void;
  addLayerEditingName: string;
  addLayerErrorMessage?: string;

  onClickRenameLayer: (targetLayerName: string) => void;
  onRenameLayerNameChange: (editingName: string) => void;
  onRenameLayer: (currentName: string, newName: string) => void;
  onCloseRenameLayerDialog: () => void;
  renameLayerEditingName: string;
  renameLayerCurrentName: string;
  renameLayerErrorMessage?: string;

  onSortList: (oldIndex: number, newIndex: number) => void;

  onDeleteLayer: (targetLayerName: string) => void;

  // Context theme API.
  theme?: {
    layerSetup: string;
  };
}


/******************* COMPONENT *******************/

class LayerSetup extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  public render() {
    return(
      <div className={this.props.theme.layerSetup}>
        <LayerAdderComponent disabled={this.props.addLayerDisabled}
          name={this.props.addLayerEditingName}
          onNameChange={this.props.onAddLayerNameChange}
          onAddLayer={this.props.onAddLayer}
          error={this.props.addLayerErrorMessage}
        />
        <LayerListComponent layerStack={this.props.layerStack}
          onClickRename={this.props.onClickRenameLayer}
          onClickDelete={this.props.onDeleteLayer}
          onSort={this.props.onSortList}
        />        
        <LayerRenamerComponent
            currentName={this.props.renameLayerCurrentName}
            newName={this.props.renameLayerEditingName}
            openDialog={Boolean(this.props.renameLayerCurrentName)}
            onNameChange={this.props.onRenameLayerNameChange}
            onRenameLayer={this.props.onRenameLayer}
            onCloseDialog={this.props.onCloseRenameLayerDialog}
            error={this.props.renameLayerErrorMessage}
        />
      </div>
    );
  }
}
export const LayerSetupComponent = themr(identifiers.layerSetup)(LayerSetup);
