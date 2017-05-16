import * as React from "react";
import ReorderIcon from "material-ui/svg-icons/action/reorder";
import {SortableContainer, SortableElement, SortableHandle} from "react-sortable-hoc";

import { LayerStack } from "../../../../models/layerModel";
import { LayerItemComponent } from "../layerItem";
const styles = require("./layerList.theme.scss");

interface Props {
  layerStack: LayerStack;
}

// These are subcomponents needed from react-sortable-hoc.
// They are too simple and static to break into new independent components.
const DragHandle = SortableHandle(() => {
  return (
    <ReorderIcon className={styles.dragHandle}
                 color={styles.dragHandleColor} />
  );
});

const SortableItem = SortableElement(({value}) => {
  return (
    <div><DragHandle /> {value}</div>
  );
});

const SortableList = SortableContainer(({items}) => {
  return (
    <div className={styles.sortableList}>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </div>
  );
});


export class LayerListComponent extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  public render() {
    const layerList = this.props.layerStack.map((layer) => {
      return (<LayerItemComponent layerParams={layer} />);
    });

    return(
      <SortableList
        items={layerList}
        useDragHandle={true}
      />
    );
  }
}
