/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { Link } from "react-toolbox/lib/link";

import { identifiers } from "../../identifiers";
import { localFileDownloader } from "../../rest-api/localFileDownloader";


/******************* INTERFACE *******************/

interface Props {
  object: any;

  // Context theme API.
  theme?: {
    link: string;
  };
}


/******************* COMPONENT *******************/

class JSONExporter extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  private encodeObject = (object: any): string => {
    return "data:$text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(object));
  }

  private handleClick = (event) => {
    event.preventDefault();
    localFileDownloader.downloadURL(
      "halftone_preset.json",
      this.encodeObject(this.props.object)
    )
  }

  public render() {
    return(
      <Link className={this.props.theme.link} 
        href="#"
        label="Export"
        icon="vertical_align_bottom"
        onClick={this.handleClick}
      />
    );
  }
}
export const JSONExporterComponent = themr(identifiers.jsonExporter)(JSONExporter);