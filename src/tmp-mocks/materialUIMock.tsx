// **************************************************************
// TEST COMPONENT AREA. FOR TESTING ONLY, TO BE DELETED.
import * as React from "react";
import IconButton from "material-ui/IconButton";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import DeleteIcon from "material-ui/svg-icons/action/delete";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import {grey400, cyanA400} from "material-ui/styles/colors";
import {ListItem} from "material-ui/List";

// This is from reac-sortable component.
import {SortableContainer, SortableElement, SortableHandle} from "react-sortable-hoc";

const DragHandle = SortableHandle(() => <span>::</span>); // This can be any component you want
const SortableItem = SortableElement(({value}) => <li><DragHandle /> {value}</li>);
const SortableList = SortableContainer(({items}) => {
  return (
    <ul style={{listStyle: "none"}}>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </ul>
  );
});


// This is from Material-UI collection.
const iconButtonElement = (
    <IconButton
      touch={true}
      tooltip="more"
      tooltipPosition="bottom-left"
    >
      <MoreVertIcon color={grey400}
                    hoverColor={cyanA400}
      />
    </IconButton>
  );

  const rightIconMenu = (
    <IconMenu iconButtonElement={iconButtonElement}>
      <MenuItem>Rename</MenuItem>
      <MenuItem leftIcon={<DeleteIcon />}>Delete</MenuItem>
    </IconMenu>
  );


// Here we compose a material UI component into a sortable list.
export const TestComponent = () => {
  return (
    <SortableList
      items={[
        (<ListItem
        rightIconButton={rightIconMenu}
        primaryText="List Item 2"
      />),
        (<span>List Item 1</span>),
        (<span>List Item 2</span>),
        (<span>List Item 3</span>),
        (<span>List Item 4</span>),
      ]}
      useDragHandle={true}
    />
  );
};
// **************************************************************




{/*(<ListItem
        rightIconButton={rightIconMenu}
        primaryText="List Item 1"
      />),
      (<ListItem
        rightIconButton={rightIconMenu}
        primaryText="List Item 2"
      />),
      (<ListItem
        rightIconButton={rightIconMenu}
        primaryText="List Item 3"
      />),
      (<ListItem
        rightIconButton={rightIconMenu}
        primaryText="List Item 4"
      />),*/}