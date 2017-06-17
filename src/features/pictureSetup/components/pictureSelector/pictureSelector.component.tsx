/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { List, ListItem, ListSubHeader } from "react-toolbox/lib/list";

import { identifiers } from "../../../../identifiers";
import { SampleImageItem } from "../../../../models/sampleImageModel";


/******************* INTERFACE *******************/

interface Props {
  sampleImageList: SampleImageItem[];
  onImageUrlChange: (newImageUrl: string) => void;

  // Add class name from parent.
  className?: string;

  // Context theme API.
  theme?: {
    container: string;
    list: string;
    listItem: string;
  };
}


/******************* COMPONENT *******************/

class PictureSelector extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  private handleImageChange = (itemClicked: SampleImageItem): void => {
      this.props.onImageUrlChange(itemClicked.url);
  }

  public render() {
    const itemList = this.props.sampleImageList.map((item) => (
      <ListItem className={this.props.theme.listItem} key={item.value}
        caption={item.label}
        legend={item.description}
        avatar={item.url}
        onClick={(event) => this.handleImageChange(item)}
      />
    ));

    return(
      <div className={`${this.props.className || ""} ${this.props.theme.container}`.trim()}>
        <List className={this.props.theme.list} selectable ripple>
          <ListSubHeader caption="Sample Pictures"/>
          {itemList}
        </List>
      </div>
    );
  }
}
export const PictureSelectorComponent = themr(identifiers.pictureSelector)(PictureSelector);