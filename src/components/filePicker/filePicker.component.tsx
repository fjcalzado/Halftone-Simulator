/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { Input } from "react-toolbox/lib/input";

import { identifiers } from "../../identifiers";
import { localFileReader } from "../../rest-api/localFileReader";


/******************* INTERFACE *******************/

interface Props {
  onFileChange: (newFile: File) => void;
  button: JSX.Element;
  file?: string;
  filter?: string;

  // Add class name from parent.
  className?: string;

  // Context theme API.
  theme?: {
    container: string;
    buttonClickableContainer: string;
    inputFile: string;
  };
}


/******************* COMPONENT *******************/

class FilePicker extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  // This is a ref or the Input react components stored locally to allow
  // simulate a click on it.
  private fileInput = null;

  private handleButtonClick = (event) => {
    this.fileInput.click();
  }

  private handleFileChange = (event) => {
    if (event.target.files) {
      this.props.onFileChange(event.target.files[0]);
    }
  }

  public render() {
    return(
      <div className={`${this.props.className || ""} ${this.props.theme.container || ""}`.trim()}>
        <div className={this.props.theme.buttonClickableContainer}
          onClick={this.handleButtonClick}>{this.props.button}</div>
        <input className={this.props.theme.inputFile}
          ref={(input) => this.fileInput = input }
          type="file"
          accept={this.props.filter}
          name="filePicker"
          value={this.props.file || ""}
          onChange={this.handleFileChange}
        />
      </div>
    );
  }
}
export const FilePickerComponent = themr(identifiers.filePicker)(FilePicker);