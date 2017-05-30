/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { SortableContainer, SortableElement, SortableHandle } from "react-sortable-hoc";

import { identifiers } from "../../../../identifiers";
import { LayerStack } from "../../../../models/layerModel";
import { LayerItemComponent } from "../layerItem";


/******************* INTERFACE *******************/

interface Props {
  layerStack: LayerStack;
  onClickRename: (targetItemName: string) => void;
  onClickDelete: (targetItemName: string) => void;
  onSort: (oldIndex: number, newIndex: number) => void;
  selectedLayer: string;
  onSelectLayer: (targetItemName: string) => void;

  // Context theme API.
  theme?: {
    sortableList: string;
    sortableItem: string;
  };
}


/******************* COMPONENT *******************/

class LayerList extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  public render() {
    // Rebuild each layer item component in the list on each render.
    const layerList = this.props.layerStack.map((layerParams) => {
      return (
        <LayerItemComponent layerParams={layerParams}
          onClickRename={this.props.onClickRename}
          onClickDelete={this.props.onClickDelete}
          onSelectLayer={this.props.onSelectLayer}
          selected={(layerParams.name === this.props.selectedLayer) ? true : false}
        />
      );
    });

    return(
      <this.SortableList
        items={layerList}
        useDragHandle={true}
        onSortEnd={({oldIndex, newIndex}) => this.props.onSort(oldIndex, newIndex)}
      />
    );
  }

  // These are subcomponents needed from react-sortable-hoc.
  // They are too simple and static to break into new independent components.
  private SortableItem = SortableElement(({value}) => {
    return (
      <div className={this.props.theme.sortableItem}>{value}</div>
    );
  });

  private SortableList = SortableContainer(({items}) => {
    return (
      <div className={this.props.theme.sortableList}>
        {items.map((value, index) => (
          <this.SortableItem key={`item-${index}`} index={index} value={value} />
        ))}
      </div>
    );
  });
}
export const LayerListComponent = themr(identifiers.layerList)(LayerList);


