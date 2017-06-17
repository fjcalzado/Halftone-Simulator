/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { Button } from "react-toolbox/lib/button";
import { Dialog } from "react-toolbox/lib/dialog";
import { Input } from "react-toolbox/lib/input";
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
    sizeInput: string;
  };
}

interface State {
  openDialog: boolean;
  outWidth: number;
  outHeight: number;
  outAspectRatio: number;
  validationError: string;
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
      validationError: "",
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
      outHeight: size.height,
      outAspectRatio: size.ar,
    });
  }

  private handleClickCancel = (event) => {
    this.setState({
      ...this.state,
      openDialog: false,
    });
  }

  private getContentToDownload = (): string => {
    return  (new XMLSerializer()).serializeToString(document.getElementById(identifiers.svgNodeId));
  }

  private handleClickDownloadSVG = () => {
    const content = this.getContentToDownload();
    localFileDownloader.downloadContent("halftone.svg", content, "image/svg+xml;charset=utf-8");
    localFileDownloader.clean();
  }

  private handleClickDownloadPNG = () => {
    const content = this.getContentToDownload();
    const inputUrl = convertDataToURL(content, "image/svg+xml;charset=utf-8");
    convertURLToPNG(inputUrl, this.state.outWidth, this.state.outHeight)
      .then((outputUrl) => {
        localFileDownloader.downloadURL("halftone.png", outputUrl);
        localFileDownloader.clean();
      })
      .catch((error) => {
        console.error(`[ERROR] Downloading PNG: ${error.message}`);
        throw error;  // Let error bubbles up.
      });
  }

  private validateSize = (value: string): boolean => {
    return /^\d+$/.test(value) && (Number(value) > 0);
  }

  private handlePNGWidthChange = (newValue: string) => {
    if (this.validateSize(newValue)) {
      const width = Number(newValue);
      this.setState({
        ...this.state,
        outWidth: width,
        outHeight: Math.round(width / this.state.outAspectRatio),
        validationError: "",
      });
    } else {
      this.setState({
        ...this.state,
        validationError: "Invalid value",
      });
    }
  }

  private handlePNGHeightChange = (newValue) => {
    if (this.validateSize(newValue)) {
      const height = Number(newValue);
      this.setState({
        ...this.state,
        outWidth: Math.round(height * this.state.outAspectRatio),
        outHeight: height,
        validationError: "",
      });
    } else {
      this.setState({
        ...this.state,
        validationError: "Invalid value",
      });
    }
  }

  public render() {
    return(
      <div className={this.props.theme.container}>
        <Button className={this.props.theme.floatButton}
          icon="file_download"
          accent floating
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
            <Tab label="PNG" ripple={false}>
              <p>Download as PNG image. Please, set the output size in pixels:</p>
              <br/>
              <Input className={this.props.theme.sizeInput}
                type="text"
                name="png_width"
                label={"Width in Pixels"}
                value={this.state.outWidth}
                error={this.state.validationError}
                onChange={this.handlePNGWidthChange}
                maxLength={5}
              />
              <Input className={this.props.theme.sizeInput}
                type="text"
                name="png_height"
                label={"Height in Pixels"}
                value={this.state.outHeight}
                error={this.state.validationError}
                onChange={this.handlePNGHeightChange}
                maxLength={5}
              />
              <br/>
              <span>
                <Button className={this.props.theme.downloadButton}
                  icon="file_download"
                  label="PNG"
                  raised accent
                  onClick={this.handleClickDownloadPNG}
                />
              </span>
            </Tab>
            <Tab label="SVG" ripple={false}>
              <p>Download as vector graphics.</p>
              <br/>
              <span>
                <Button className={this.props.theme.downloadButton}
                  icon="file_download"
                  label="SVG"
                  raised accent
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
