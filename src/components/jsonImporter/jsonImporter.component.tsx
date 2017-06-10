/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { Link } from "react-toolbox/lib/link";

import { identifiers } from "../../identifiers";
import { FilePickerComponent } from "../filePicker";
import { localFileReader } from "../../rest-api/localFileReader";
import { logDebug } from "../../util/log";


/******************* INTERFACE *******************/

interface Props {
  onImport: (object: any) => void;

  // Context theme API.
  theme?: {
    link: string;
    filePicker: string
  };
}


/******************* COMPONENT *******************/

class JSONImporter extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  private decodeObject = (text: string): any => {
    const object = JSON.parse(text);
    if (!object) {
      logDebug(`[ERROR] Parsing Local JSON: ${text}`);
    }
    return object; 
  }

  private handleFileChange = (file: File) => {
    if (file) {
      localFileReader.getLocalFileAsText(file)
      .then((text) => this.props.onImport(this.decodeObject(text)))
      .catch((error) => logDebug(`[ERROR] Loading Local File: ${error}`));
    }
  }

  public render() {
    return(
      <FilePickerComponent className={`${this.props.theme.filePicker || ""}`.trim()}
        onFileChange={this.handleFileChange}
        filter=".json"
        button={(
          <Link className={this.props.theme.link} 
            href="#"
            label="Import"
            icon="vertical_align_top"
          />
        )}
      />
    );
  }
}
export const JSONImporterComponent = themr(identifiers.jsonImporter)(JSONImporter);