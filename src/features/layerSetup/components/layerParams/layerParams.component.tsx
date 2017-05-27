/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from "react-toolbox/lib/list";
import { Switch } from "react-toolbox/lib/switch";
import { Dropdown } from "react-toolbox/lib/dropdown";

import { identifiers } from "../../../../identifiers";
import { SliderExComponent } from "../../../../components/sliderEx";
import { LayerParameters } from "../../../../models/layerModel";
import { GridPatternType } from "../../../../models/gridModel";

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

  private handleGridChange = (field, value) => {
    this.props.onLayerParamsChanged({
      ...this.props.layerParams,
      gridParams: {
        ...this.props.layerParams.gridParams,
        [field]: value,
      },
    });
  }

  public render() {
      return(
        <List className={this.props.theme.list}>
          <ListSubHeader caption="Layer Properties" />
            <this.Visibility />
            <this.Opacity />
          <ListSubHeader caption="Grid Configuration" />
            <this.Pattern />
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
        displayMin={0} displayMax={100} displayStep={1}
        label={"Opacity"}
        value={this.props.layerParams.opacity}
        onChange={this.handleLayerChange.bind(this, "opacity")}
      />
    );
  }

  private gridPatterns = [
        GridPatternType.Square, GridPatternType.Brick,
        GridPatternType.Triangle, GridPatternType.Hex,
        GridPatternType.Random, GridPatternType.Wave,
        GridPatternType.Chevron, GridPatternType.Radial,
     ].map((item) => ({value: item, label: item}));

  private Pattern = () => {
     return (
      <Dropdown
        label={"Pattern"}
        source={this.gridPatterns}
        value={this.props.layerParams.gridParams.pattern}
        onChange={this.handleGridChange.bind(this, "pattern")}
      />
    );
  }

}
export const LayerParamsComponent = themr(identifiers.layerParams)(LayerParams);
