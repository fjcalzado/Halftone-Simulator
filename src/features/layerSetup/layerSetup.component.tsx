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
import { JSONExporterComponent } from "../../components/jsonExporter";


/******************* INTERFACE *******************/

interface Props {
  layerStack: LayerStack;
  onClickDrawLayers: (event) => void;
  onClickResetLayers: (event) => void;

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
  selectedLayer: string;
  onSelectedLayerParamsChanged: (lp: LayerParameters) => void;

  // Context theme API.
  theme?: {
    container: string;
  };
}


/******************* COMPONENT *******************/

class LayerSetup extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  public render() {
    const selectedLayerParams = this.props.layerStack.find((item) =>
      item.name === this.props.selectedLayer);

    return(
      <div className={this.props.theme.container}>
        {/*// TODO: To be inserted as Card action.*/}
        <Button icon="done" label="Apply" raised accent
          onClick={this.props.onClickDrawLayers} />
        <Button icon="undo" label="Reset"
          onClick={this.props.onClickResetLayers} />

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
          selectedLayer={this.props.selectedLayer}
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
        {selectedLayerParams ?
          (<LayerParamsComponent
            layerParams={selectedLayerParams}
            onLayerParamsChanged={this.props.onSelectedLayerParamsChanged}
          />) : null
        }

        <JSONExporterComponent object={this.props.layerStack}/>
      </div>
    );
  }
}
export const LayerSetupComponent = themr(identifiers.layerSetup)(LayerSetup);
