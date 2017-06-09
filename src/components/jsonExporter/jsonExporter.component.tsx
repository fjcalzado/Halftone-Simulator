/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { Link } from "react-toolbox/lib/link";

import { identifiers } from "../../identifiers";


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
    return "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(object));
  }

  public render() {
    return(
      <Link className={this.props.theme.link} 
        href={`data:${this.encodeObject(this.props.object)}`}
        label="Export"
        icon="file_download"
        download="halftone_preset.json"
      />
    );
  }
}
export const JSONExporterComponent = themr(identifiers.jsonExporter)(JSONExporter);