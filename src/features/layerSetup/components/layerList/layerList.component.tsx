/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { SortableContainer, SortableElement, SortableHandle } from "react-sortable-hoc";
import { FontIcon } from "react-toolbox/lib/font_icon";

import { identifiers } from "../../../../identifiers";
import { LayerStack } from "../../../../models/layerModel";
import { LayerItemComponent } from "../layerItem";


/******************* INTERFACE *******************/

interface Props {
  layerStack: LayerStack;
  onClickRename: (targetItemName: string) => void;
  onClickDelete: (targetItemName: string) => void;
  onSort: (oldIndex: number, newIndex: number) => void;

  // Context theme API.
  theme?: {
    dragHandle: string;
    sortableList: string;
    sortableItem: string;
    sortableItemContent: string;
  };
}


/******************* COMPONENT *******************/

class LayerList extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  public render() {
    // Rebuild each layer item component in the list on each render.
    const layerList = this.props.layerStack.map((layer) => {
      return (
        <LayerItemComponent layerParams={layer}
          onClickRename={this.props.onClickRename}
          onClickDelete={this.props.onClickDelete} />
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
  private DragHandle = SortableHandle(() => {
    return (
      <FontIcon className={this.props.theme.dragHandle}
                value="reorder" />
    );
  });

  private SortableItem = SortableElement(({value}) => {
    return (
      <div className={this.props.theme.sortableItem}>
        <this.DragHandle /> {value}
      </div>
    );
  });

  private SortableList = SortableContainer(({items}) => {
    return (
      <div className={this.props.theme.sortableList}>
        {items.map((value, index) => (
          <this.SortableItem key={`item-${index}`} index={index} value={
            <div className={this.props.theme.sortableItemContent}>{value}</div>} />
        ))}
      </div>
    );
  });
}
export const LayerListComponent = themr(identifiers.layerList)(LayerList);


