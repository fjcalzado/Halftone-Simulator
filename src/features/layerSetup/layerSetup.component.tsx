/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { Button } from "react-toolbox/lib/button";

import { identifiers } from "../../identifiers";
import { LayerParameters, LayerStack } from "../../models/layerModel";
import { LayerAdderComponent } from "./components/layerAdder";
import { LayerListComponent } from "./components/layerList";
import { LayerRenamerComponent } from "./components/layerRenamer";
import { LayerParamsComponent } from "./components/layerParams";


/******************* INTERFACE *******************/

interface Props {
  layerStack: LayerStack;
  onClickDrawLayers: (event) => void;

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

  onDeleteLayer: (targetLayerName: string) => void;
  onSortList: (oldIndex: number, newIndex: number) => void;

  onSelectLayer: (targetLayerName: string) => void;
  selectedLayerParams: LayerParameters;
  onSelectedLayerParamsChanged: (lp: LayerParameters) => void;

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
        {/*// TODO: To be inserted as Card action.*/}
        <Button icon="brush" label="Draw" raised accent
          onClick={this.props.onClickDrawLayers} />

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
          onSelectLayer={this.props.onSelectLayer}
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

        {/*// TODO: To be inserted in Cards, one on top of the other.*/}
        {this.props.selectedLayerParams ?
          (<LayerParamsComponent
            layerParams={this.props.selectedLayerParams}
            onLayerParamsChanged={this.props.onSelectedLayerParamsChanged}
          />) : null
        }
      </div>
    );
  }
}
export const LayerSetupComponent = themr(identifiers.layerSetup)(LayerSetup);
