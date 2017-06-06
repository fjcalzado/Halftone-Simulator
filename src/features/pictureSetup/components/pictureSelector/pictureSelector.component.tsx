/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { Dropdown } from "react-toolbox/lib/dropdown";

import { identifiers } from "../../../../identifiers";
import { SampleImageItem } from "../../../../models/sampleImageModel";


/******************* INTERFACE *******************/

interface Props {
  imageUrl: string;
  sampleImageList: Array<SampleImageItem>;
  onImageUrlChange: (newImageUrl: string) => void;

  // Context theme API.
  theme?: {
    container: string;
    dropdown: string;
    item: string;
    itemPictureContainer: string;    
    itemPicture: string;
    itemCaption: string;
  };
}


/******************* COMPONENT *******************/

class PictureSelector extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  private handleImageChange = (newValue): void => {
    const url = this.valueToUrl(newValue);
    if(url) {
      this.props.onImageUrlChange(url);
    }
  }

  private valueToUrl = (value: string): string => {
    const sampleImage = this.props.sampleImageList.find((item) => item.value === value);
    if (sampleImage) { return sampleImage.url; }
    else { return ""; }
  }

  private urlToValue = (url: string): string => {
    const sampleImage = this.props.sampleImageList.find((item) => item.url === url);
    if(sampleImage) { return sampleImage.value; }
    else { return ""; }
  }

  public render() {
    const customItem = (item) =>  
      (<div className={this.props.theme.item}>
        <div className={this.props.theme.itemPictureContainer} >
          <img className={this.props.theme.itemPicture} src={item.url} />
        </div>
        <div className={this.props.theme.itemCaption} >
          <strong>{item.label}</strong>
          <small>{item.description}</small>
        </div>
      </div>);

    return(
      <div className={this.props.theme.container}>
        <Dropdown className={this.props.theme.dropdown}
          source={this.props.sampleImageList}
          template={customItem}
          label="Select Sample Picture"
          onChange={this.handleImageChange}
          value={this.urlToValue(this.props.imageUrl)}
        />
      </div>
    );
  }
}
export const PictureSelectorComponent = themr(identifiers.pictureSelector)(PictureSelector);