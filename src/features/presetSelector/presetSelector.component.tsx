/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { List, ListItem } from "react-toolbox/lib/list";

import { identifiers } from "../../identifiers";
import { Preset, PresetCollection } from "../../models/presetModel";
import { LayerStack } from "../../models/layerModel";

/******************* INTERFACE *******************/

interface Props {
  presetList: PresetCollection;
  onSelectPreset: (layerStack: LayerStack) => void;

  // Context theme API.
  theme?: {
    container: string;
    list: string;
    listItem: string;
  };
}


/******************* COMPONENT *******************/

class PresetSelector extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  private handleClick = (json: any) => {
    this.props.onSelectPreset(json as LayerStack);
  }

  public render() {
    const itemList = this.props.presetList.map((item, index) => (
      <ListItem className={this.props.theme.listItem} key={index}
        caption={item.name}
        legend={item.description}
        avatar={item.thumbnailUrl}
        onClick={(event) => this.handleClick(item.json)}
      />
    ));

    return(
      <div className={this.props.theme.container}>
        <List className={this.props.theme.list} selectable ripple>
          {itemList}
        </List>
      </div>
    );
  }
}
export const PresetSelectorComponent = themr(identifiers.presetSelector)(PresetSelector);
