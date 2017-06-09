/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { Button } from "react-toolbox/lib/button";

import { identifiers } from "../../../../identifiers";
import { FilePickerComponent } from "../../../../components/filePicker";
import { localFileReader } from "../../../../rest-api/localFileReader";
import { logDebug } from "../../../../util/log";


/******************* INTERFACE *******************/

interface Props {
  onImageUrlChange: (newImgUrl: string) => void;

  // Add class name from parent.
  className?: string;

  // Context theme API.
  theme?: {
    container: string;
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

  private handleFileChange = (file: File) => {
    if (file) {
      localFileReader.getLocalFileAsURL(file)
      .then((url) => this.props.onImageUrlChange(url))
      .catch((error) => logDebug(`[ERROR] Loading Local File: ${error}`));
    }
  }

  public render() {
    return(
      <FilePickerComponent className={`${this.props.className || ""} ${this.props.theme.container || ""}`.trim()}
        onFileChange={this.handleFileChange}
        button={(
          <Button
            icon="file_upload"
            label="Upload"
            raised          
          />
        )}
      />
    );
  }
}
export const PictureUploadComponent = themr(identifiers.pictureUpload)(PictureUpload);