/******************* IMPORT *******************/
import * as React from "react";
//import { themr } from "react-css-themr";
import { SortableContainer, SortableElement, SortableHandle } from "react-sortable-hoc";
import { FontIcon } from "react-toolbox/lib/font_icon";

import { LayerStack } from "../../../../models/layerModel";
import { LayerItemComponent } from "../layerItem";

const styles = require("./layerList.scss");


/******************* INTERFACE *******************/

interface Props {
  layerStack: LayerStack;
  onClickRename: (targetItemName: string) => void;
  onClickDelete: (targetItemName: string) => void;
}


/******************* COMPONENT *******************/
//@themr("CMPLayerList")
export class LayerListComponent extends React.Component<Props, {}> {
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
      <SortableList
        items={layerList}
        useDragHandle={true}
      />
    );
  }
}

// These are subcomponents needed from react-sortable-hoc.
// They are too simple and static to break into new independent components.
const DragHandle = SortableHandle(() => {
  return (
    <FontIcon className={styles.dragHandle}
              value="reorder" />
  );
});

const SortableItem = SortableElement(({value}) => {
  return (
    <div className={styles.sortableItem}>
      <DragHandle /> {value}
    </div>
  );
});

const SortableList = SortableContainer(({items}) => {
  return (
    <div className={styles.sortableList}>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={
          <div className={styles.sortableItemContent}>{value}</div>} />
      ))}
    </div>
  );
});
