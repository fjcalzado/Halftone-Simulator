/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from "react-toolbox/lib/list";
import { Switch } from "react-toolbox/lib/switch";
import { Dropdown } from "react-toolbox/lib/dropdown";

import { identifiers } from "../../../../identifiers";
import { SliderExComponent } from "../../../../components/sliderEx";
import { ColorPickerToggleableComponent } from "../../../../components/colorPickerToggleable";
import { LayerParameters } from "../../../../models/layerModel";
import { GridPatternType, CreateDefaultSpecificParams } from "../../../../models/gridModel";
import { DotType } from "../../../../models/dotModel";
import { Channel } from "../../../../models/channelModel";

/******************* INTERFACE *******************/

interface Props {
  layerParams: LayerParameters;
  onLayerParamsChanged: (editingLp: LayerParameters) => void;

  // Context theme API.
  theme?: {
    list: string;
    listInnerItem: string;
  };
}


/******************* COMPONENT *******************/

class LayerParams extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  private handleLayerChange = (field, value) => {
    this.props.onLayerParamsChanged({
      ...this.props.layerParams,
      [field]: value,
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

  private handleGridSpecificParamsChange = (field, value) => {
    this.props.onLayerParamsChanged({
      ...this.props.layerParams,
      gridParams: {
        ...this.props.layerParams.gridParams,
        specificParams: {
          ...this.props.layerParams.gridParams.specificParams,
          [field]: value,
        },
      },
    });
  }

  private handleDotChange = (field, value) => {
    this.props.onLayerParamsChanged({
      ...this.props.layerParams,
      dotParams: {
        ...this.props.layerParams.dotParams,
        [field]: value,
      },
    });
  }

  public render() {
  // TODO: Embedd into list items.
      return(
        <List className={this.props.theme.list}>
          <ListSubHeader caption="Layer Properties" />
            <ListItem itemContent={<this.Visibility />}/>
            <ListItem itemContent={<this.Opacity />}/>
          <ListSubHeader caption="Grid Configuration" />
            <ListItem itemContent={<this.GridPattern />}/>
            <ListItem itemContent={<this.GridScale />}/>
            <ListItem itemContent={<this.GridRotation />}/>
            {this.GridSpecificParams() ?
              (<ListItem itemContent={<this.GridSpecificParams />}/>) : null
            }
          <ListSubHeader caption="Dot Configuration" />
            <ListItem itemContent={<this.DotShape />}/>
            <ListItem itemContent={<this.DotSizeBinding />}/>
            <ListItem itemContent={<this.DotSizeMinThreshold />}/>
            <ListItem itemContent={<this.DotSizeMaxThreshold />}/>
            <ListItem itemContent={<this.DotRotation />}/>
            <ListItem itemContent={<this.DotCustomColor />}/>
        </List>
      );
  }

  /******************* SUB-COMPONENTS *******************/

  // LAYER PARAMS.

  private Visibility = () => {
    return (
      <Switch className={this.props.theme.listInnerItem}
        checked={this.props.layerParams.visible}
        label="Toggle Visibility"
        onChange={this.handleLayerChange.bind(this, "visible")}
      />
    );
  }

  private Opacity = () => {
    return (
      <SliderExComponent className={this.props.theme.listInnerItem}
        editable min={0} max={1}
        displayMin={0} displayMax={100} displayStep={1}
        label={"Opacity"}
        value={this.props.layerParams.opacity}
        onChange={this.handleLayerChange.bind(this, "opacity")}
      />
    );
  }

  // GRID TOPOLOGY.

  private gridPatterns = Object.keys(GridPatternType).map((item) => ({value: item, label: item}));

  private GridPattern = () => {
     return (
      <Dropdown className={this.props.theme.listInnerItem}
        label={"Pattern"}
        source={this.gridPatterns}
        value={this.props.layerParams.gridParams.pattern}
        onChange={this.handleGridChange.bind(this, "pattern")}
      />
    );
  }

  private GridScale = () => {
    return (
      <SliderExComponent className={this.props.theme.listInnerItem}
        editable min={0} max={2}
        displayMin={0} displayMax={200} displayStep={1}
        label={"Scale"}
        value={this.props.layerParams.gridParams.scaleFactor}
        onChange={this.handleGridChange.bind(this, "scaleFactor")}
      />
    );
  }

  private GridRotation = () => {
    return (
      <SliderExComponent className={this.props.theme.listInnerItem}
        editable min={-180} max={180}
        displayMin={-180} displayMax={180} displayStep={1}
        label={"Rotation"}
        value={this.props.layerParams.gridParams.rotationAngle}
        onChange={this.handleGridChange.bind(this, "rotationAngle")}
      />
    );
  }

  private GridSpecificParams = () => {
    let sp = this.props.layerParams.gridParams.specificParams;

    switch (this.props.layerParams.gridParams.pattern) {

      case GridPatternType.Hex:
        if (!sp || !sp.hasOwnProperty("radius")) {
          sp = CreateDefaultSpecificParams(GridPatternType.Hex);
        }
        return (
          <SliderExComponent className={this.props.theme.listInnerItem}
            editable min={0.5} max={2}
            displayMin={0.5} displayMax={2} displayStep={0.05}
            label={"Radius"}
            value={sp.radius}
            onChange={this.handleGridSpecificParamsChange.bind(this, "radius")}
          />
        );

      case GridPatternType.Random:
        if (!sp || !sp.hasOwnProperty("limit")) {
          sp = CreateDefaultSpecificParams(GridPatternType.Random);
        }
        return (
          <SliderExComponent className={this.props.theme.listInnerItem}
            editable min={0.5} max={5}
            displayMin={0.5} displayMax={5} displayStep={0.05}
            label={"Limit"}
            value={sp.limit}
            onChange={this.handleGridSpecificParamsChange.bind(this, "limit")}
          />
        );

      case GridPatternType.Wave:
        if (!sp || !sp.hasOwnProperty("wavelength") || !sp.hasOwnProperty("amplitude")) {
          const def = CreateDefaultSpecificParams(GridPatternType.Wave);
          if (!sp ) {
            sp = def;
          } else if (!sp.hasOwnProperty("wavelength")) {
            sp = {...sp, wavelength: def.wavelength};
          } else if (!sp.hasOwnProperty("amplitude")) {
            sp = {...sp, amplitude: def.amplitude};
          }
        }
        return (
          <div>
            <SliderExComponent className={this.props.theme.listInnerItem}
              editable min={4} max={50}
              displayMin={4} displayMax={50} displayStep={1}
              label={"Wavelength"}
              value={sp.wavelength}
              onChange={this.handleGridSpecificParamsChange.bind(this, "wavelength")}
            />
            <SliderExComponent className={this.props.theme.listInnerItem}
              editable min={1} max={20}
              displayMin={1} displayMax={20} displayStep={1}
              label={"Amplitude"}
              value={sp.amplitude}
              onChange={this.handleGridSpecificParamsChange.bind(this, "amplitude")}
            />
          </div>
        );

       case GridPatternType.Chevron:
        if (!sp || !sp.hasOwnProperty("length") || !sp.hasOwnProperty("amplitude")) {
          const def = CreateDefaultSpecificParams(GridPatternType.Chevron);
          if (!sp ) {
            sp = def;
          } else if (!sp.hasOwnProperty("length")) {
            sp = {...sp, wavelength: def.length};
          } else if (!sp.hasOwnProperty("amplitude")) {
            sp = {...sp, amplitude: def.amplitude};
          }
        }
        return (
          <div>
            <SliderExComponent className={this.props.theme.listInnerItem}
              editable min={4} max={50}
              displayMin={4} displayMax={50} displayStep={1}
              label={"Length"}
              value={sp.length}
              onChange={this.handleGridSpecificParamsChange.bind(this, "length")}
            />
            <SliderExComponent className={this.props.theme.listInnerItem}
              editable min={1} max={20}
              displayMin={1} displayMax={20} displayStep={1}
              label={"Amplitude"}
              value={sp.amplitude}
              onChange={this.handleGridSpecificParamsChange.bind(this, "amplitude")}
            />
          </div>
        );

      default:
        return null;
    }
  }

  // DOT TOPOLOGY.

  private dotShapes = Object.keys(DotType).map((item) => ({value: item, label: item}));

  private DotShape = () => {
     return (
      <Dropdown className={this.props.theme.listInnerItem}
        label={"Shape"}
        source={this.dotShapes}
        value={this.props.layerParams.dotParams.shape}
        onChange={this.handleDotChange.bind(this, "shape")}
      />
    );
  }

  // Prefilter size binding combo by removing composite channels (RGB, HSL, etc) and Hue.
  private dotSizeBindings = Object.keys(Channel).map((item) => ({value: item, label: item}))
                            .filter((item) => (item.value !== "RGB") && (item.value !== "HSL")
                            && (item.value !== "CMYK") && (item.value !== "Hue"));

  private DotSizeBinding = () => {
     return (
      <Dropdown className={this.props.theme.listInnerItem}
        label={"Size Binding"}
        source={this.dotSizeBindings}
        value={this.props.layerParams.dotParams.sizeBinding}
        onChange={this.handleDotChange.bind(this, "sizeBinding")}
      />
    );
  }

  private DotSizeMinThreshold = () => {
    return (
      <SliderExComponent className={this.props.theme.listInnerItem}
        editable min={0} max={2}
        displayMin={0} displayMax={200} displayStep={1}
        label={"Min"}
        value={this.props.layerParams.dotParams.sizeMinThreshold}
        onChange={ (value) => {
          const max = this.props.layerParams.dotParams.sizeMaxThreshold;
          const constrainedValue = value > max ? max : value;
          this.handleDotChange("sizeMinThreshold", constrainedValue);
        }}
      />
    );
  }

  private DotSizeMaxThreshold = () => {
    return (
      <SliderExComponent className={this.props.theme.listInnerItem}
        editable min={0} max={2}
        displayMin={0} displayMax={200} displayStep={1}
        label={"Max"}
        value={this.props.layerParams.dotParams.sizeMaxThreshold}
        onChange={ (value) => {
          const min = this.props.layerParams.dotParams.sizeMinThreshold;
          const constrainedValue = value < min ? min : value;
          this.handleDotChange("sizeMaxThreshold", constrainedValue);
        }}
      />
    );
  }

  private DotRotation = () => {
    return (
      <SliderExComponent className={this.props.theme.listInnerItem}
        editable min={-180} max={180}
        displayMin={-180} displayMax={180} displayStep={1}
        label={"Rotation"}
        value={this.props.layerParams.dotParams.rotationAngle}
        onChange={this.handleDotChange.bind(this, "rotationAngle")}
      />
    );
  }

  private DotCustomColor = () => {
    return (
      <ColorPickerToggleableComponent className={this.props.theme.listInnerItem}
        label="Customize Color"
        color={this.props.layerParams.dotParams.color}
        toggled={this.props.layerParams.dotParams.colorCustom}
        disableAlpha={true}
        onChangeColor={this.handleDotChange.bind(this, "color")}
        onChangeToggle={this.handleDotChange.bind(this, "colorCustom")}
      />
    );
  }
}
export const LayerParamsComponent = themr(identifiers.layerParams)(LayerParams);
