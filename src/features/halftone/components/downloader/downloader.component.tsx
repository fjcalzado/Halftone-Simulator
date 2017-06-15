/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { Button } from "react-toolbox/lib/button";

import { identifiers } from "../../../../identifiers";
import { localFileDownloader } from "../../../../rest-api/localFileDownloader";
import { convertDataToURL, convertURLToPNG } from "../../../../util";



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
    localFileDownloader.downloadContent("halftone.svg", content, "image/svg+xml;charset=utf-8");
    localFileDownloader.clean();
  }

  private handleDownloadPNG = () => {
    const content = (new XMLSerializer()).serializeToString(document.getElementById("svg-node"));
    const inputUrl = convertDataToURL(content, "image/svg+xml;charset=utf-8");
    convertURLToPNG(inputUrl, 600, 800)
      .then((outputUrl) => {
        localFileDownloader.downloadURL("halftone.png", outputUrl);
        localFileDownloader.clean();
      })
      .catch((error) => {
        console.error(`[ERROR] Downloading PNG: ${error.message}`);
        throw error;  // Let error bubbles up.
      });
  }

  public render() {
    return(
      <div className={this.props.theme.container}>
        <Button className={this.props.theme.button}
          icon="file_download"
          primary floating
          onClick={this.handleDownloadPNG} 
        />
      </div>
    );
  }
}
export const DownloaderComponent = themr(identifiers.downloader)(Downloader);