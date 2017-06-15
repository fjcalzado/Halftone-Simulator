/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { Button } from "react-toolbox/lib/button";

import { identifiers } from "../../../../identifiers";
import { localFileDownloader } from "../../../../rest-api/localFileDownloader";



/******************* INTERFACE *******************/

interface Props {
  // Context theme API.
  theme?: {
    container: string;
    button: string;
  };
}


/******************* COMPONENT *******************/

class Downloader extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  private handleDownloadSVG = () => {
    const content = (new XMLSerializer()).serializeToString(document.getElementById("svg-node"));
    localFileDownloader.downloadContent("halftone.svg", content, "text\/xml");
    localFileDownloader.clean();
  }

  public render() {
    return(
      <div className={this.props.theme.container}>
        <Button className={this.props.theme.button}
          icon="file_download"
          primary floating
          onClick={this.handleDownloadSVG} 
        />
      </div>
    );
  }
}
export const DownloaderComponent = themr(identifiers.downloader)(Downloader);