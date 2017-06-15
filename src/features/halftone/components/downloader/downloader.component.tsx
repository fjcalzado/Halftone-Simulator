/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { Button } from "react-toolbox/lib/button";
import { Dialog } from "react-toolbox/lib/dialog";
import { Tab, Tabs } from "react-toolbox";

import { identifiers } from "../../../../identifiers";
import { localFileDownloader } from "../../../../rest-api/localFileDownloader";
import { convertDataToURL, convertURLToPNG } from "../../../../util";



/******************* INTERFACE *******************/

interface Props {
  // Context theme API.
  theme?: {
    container: string;
    button: string;
    dialog: string;
  };
}

interface State {
  openDialog: boolean;
  outWidth: number;
  outHeight: number;
  outAspectRatio: number;
}


/******************* COMPONENT *******************/

class Downloader extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      openDialog: false,
      outWidth: 800,
      outHeight: 600,
      outAspectRatio: 4/3,
    };
  }

  private calculateHalftoneViewSize = (): {width: number, height: number, ar: number} => {
    const viewport = document.getElementById(identifiers.svgViewportId);
    const viewportBBox = viewport.getBoundingClientRect();
    const size = {
      width: Math.round(Number(viewportBBox.width)),
      height: Math.round(Number(viewportBBox.height)),
      ar: viewportBBox.width / viewportBBox.height,
    }
    return size;
  }

  private handleClickDownload = (event) => {
    const size = this.calculateHalftoneViewSize();
    this.setState({
      ...this.state,
      openDialog: true,
      outWidth: size.width,
      outerHeight: size.height,
      outAspectRatio: size.ar,
    });
  }

  private handleClickCancel = (event) => {
    this.setState({
      ...this.state,
      openDialog: false,
    });
  }

  private handleDownloadSVG = () => {
    const content = (new XMLSerializer()).serializeToString(document.getElementById(identifiers.svgNodeId));
    localFileDownloader.downloadContent("halftone.svg", content, "image/svg+xml;charset=utf-8");
    localFileDownloader.clean();
  }

  private handleDownloadPNG = () => {
    const content = (new XMLSerializer()).serializeToString(document.getElementById(identifiers.svgNodeId));
    const inputUrl = convertDataToURL(content, "image/svg+xml;charset=utf-8");
    convertURLToPNG(inputUrl, 800, 800)
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
          onClick={this.handleClickDownload} 
        />
        <Dialog className={this.props.theme.dialog}
          title="Download"
          actions={this.dialogActions()}
          onEscKeyDown={this.handleClickCancel}
          onOverlayClick={this.handleClickCancel}
          active={this.state.openDialog}
        >
        </Dialog>
      </div>
    );
  }

  private dialogActions = () => [
    {label: "Cancel", onClick: this.handleClickCancel},
  ]
}
export const DownloaderComponent = themr(identifiers.downloader)(Downloader);