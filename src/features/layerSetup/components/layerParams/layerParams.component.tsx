/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from "react-toolbox/lib/list";
import { Switch } from "react-toolbox/lib/switch";


import { identifiers } from "../../../../identifiers";
import { SliderExComponent } from "../../../../components/sliderEx";
import { LayerParameters } from "../../../../models/layerModel";

/******************* INTERFACE *******************/

interface Props {
  layerParams: LayerParameters;
  onLayerParamsChanged: (editingLp: LayerParameters) => void;

  // Context theme API.
  theme?: {
    list: string;
  };
}


/******************* COMPONENT *******************/

class LayerParams extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  private handleLayerChange = (field, value) => {
    this.props.onLayerParamsChanged({
      ...this.props.layerParams, [field]: value,
    });
  }

  public render() {
      return(
        <List className={this.props.theme.list}>
          <ListSubHeader caption="Layer Properties" />
            <this.Visibility />
            <this.Opacity />
          <ListSubHeader caption="Grid Configuration" />
          <ListSubHeader caption="Dot Configuration" />
        </List>
      );
  }

  /******************* SUB-COMPONENTS *******************/

  private Visibility = () => {
    return (
      <Switch
        checked={this.props.layerParams.visible}
        label="Toggle Visibility"
        onChange={this.handleLayerChange.bind(this, "visible")}
      />
    );
  }

  private Opacity = () => {
    return (
      <SliderExComponent editable min={0} max={1}
        displayMin={0} displayMax={500} displayStep={1}
        label={"Opacity"}
        value={this.props.layerParams.opacity}
        onChange={this.handleLayerChange.bind(this, "opacity")}
      />
    );
  }
}
export const LayerParamsComponent = themr(identifiers.layerParams)(LayerParams);
