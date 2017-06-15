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
    floatButton: string;
    downloadButton: string;
    dialog: string;
    tabs: string;
  };
}

interface State {
  openDialog: boolean;
  outWidth: number;
  outHeight: number;
  outAspectRatio: number;
  tabIndex: number;
}


/******************* COMPONENT *******************/

class Downloader extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      openDialog: false,
      outWidth: 800,
      outHeight: 600,
      outAspectRatio: 4 / 3,
      tabIndex: 0,
    };
  }

  private calculateHalftoneViewSize = (): {width: number, height: number, ar: number} => {
    const viewport = document.getElementById(identifiers.svgViewportId);
    const viewportBBox = viewport.getBoundingClientRect();
    const size = {
      width: Math.round(Number(viewportBBox.width)),
      height: Math.round(Number(viewportBBox.height)),
      ar: viewportBBox.width / viewportBBox.height,
    };
    return size;
  }

  private handleTabChange = (newTab) => {
    this.setState({
      ...this.state,
      tabIndex: newTab,
    });
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

  private handleClickDownloadSVG = () => {
    const content = (new XMLSerializer()).serializeToString(document.getElementById(identifiers.svgNodeId));
    localFileDownloader.downloadContent("halftone.svg", content, "image/svg+xml;charset=utf-8");
    localFileDownloader.clean();
  }

  private handleClickDownloadPNG = () => {
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
        <Button className={this.props.theme.floatButton}
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
          <Tabs className={this.props.theme.tabs}
            index={this.state.tabIndex}
            onChange={this.handleTabChange}
          >
            <Tab label="PNG">
              <p>Download as PNG image. Please set the output size in pixels:</p>
              
              <span>
                <Button className={this.props.theme.downloadButton}
                  icon="file_download"
                  label="PNG"
                  raised primary
                  onClick={this.handleClickDownloadPNG}
                />
              </span>
            </Tab>
            <Tab label="SVG">
              <p>Download as vector graphics.</p>
              <span>
                <Button className={this.props.theme.downloadButton}
                  icon="file_download"
                  label="SVG"
                  raised primary
                  onClick={this.handleClickDownloadSVG}
                />
              </span>
            </Tab>
          </Tabs>
        </Dialog>
      </div>
    );
  }

  private dialogActions = () => [
    {label: "Cancel", onClick: this.handleClickCancel},
  ]
}
export const DownloaderComponent = themr(identifiers.downloader)(Downloader);
