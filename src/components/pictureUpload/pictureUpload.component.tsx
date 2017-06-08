/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { Input } from "react-toolbox/lib/input";
import { Button } from "react-toolbox/lib/button";

import { identifiers } from "../../identifiers";
import { localFileFetcher } from "../../rest-api/localFileFetcher";
import { logDebug } from "../../util";


/******************* INTERFACE *******************/

interface Props {
  imageUrl: string;
  onImageUrlChange: (newImgUrl: string) => void;

  // Add class name from parent.
  className?: string;

  // Context theme API.
  theme?: {
    container: string;
    inputFile: string;
    uploadButton: string;
  };
}


/******************* COMPONENT *******************/

class PictureUpload extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  // This is a ref or the Input react components stored locally to allow
  // simulate a click on it.
  private fileInput = null;

  private handleUploadClick = (event) => {
    this.fileInput.click();
  }

  private handleFileChange = (event) => {
    if (event.target.files) {
      const file = event.target.files[0];
      localFileFetcher.getLocalFileAsURL(file)
      .then((url) => this.props.onImageUrlChange(url))
      .catch((error) => logDebug(`[ERROR] Loading Local File: ${error}`));
    }
  }

  public render() {
    return(
      <div className={`${this.props.className || ""} ${this.props.theme.container || ""}`.trim()}>
        <Button className={this.props.theme.uploadButton}
          icon="file_upload"
          label="Upload"
          accent raised
          onClick={this.handleUploadClick}
        />
        <input className={this.props.theme.inputFile}
          ref={(input) => this.fileInput = input }
          type="file"
          name="pictureUpload"
          value={this.props.imageUrl}
          onChange={this.handleFileChange}
        />
      </div>
    );
  }
}
export const PictureUploadComponent = themr(identifiers.pictureUpload)(PictureUpload);