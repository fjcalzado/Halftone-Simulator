import * as chroma from "chroma-js";
import * as d3 from "d3";
import * as timer from "../../../api/timerLog";
import * as imgCh from "../api/imageChannelExtractor";
import * as dot from "./dotTopology";
import * as grd from "./gridTopology";
import * as layerManager from "./layerManager";
const styles = require("../halftoneTheme.scss");

/**
 * Module local variables.
 * @private
 */

// Input elements.
let imgMatrix: any[][] = null;
let imgWidth: number = 0;
let imgHeight: number = 0;

// Svg main elements.
let svg = null;
let svgViewport = null;

// Width and Height of the svg component in relative units.
// Fit its parent by default unless a specific relative
// size is indicated from the caller.
let widthRel = "100%";
let heightRel = "100%";
// Width and Height of the svg component in absolute units.
let widthAbs = null;
let heightAbs = null;


/**
 * Helper Functions
 * @private
 */

function calculateAbsoluteSize() {
  widthAbs = parseInt(svg.style("width"), 10);
  heightAbs = parseInt(svg.style("height"), 10);
}

/**
 * Initialization Functions
 * @private
 */

function initializeSvg(parentNodeClassName: string) {
  svg = d3.select(`.${parentNodeClassName}`)
    .append("svg")
      .attr("class", "svg")
      .attr("width", widthRel)
      .attr("height", heightRel);
  calculateAbsoluteSize();
  svgViewport = svg
      .attr("viewBox", `-1 -1 ${imgWidth + 2} ${imgHeight + 2}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
      .attr("class", "svg-viewport");
}

function initializeGrid() {

  const gridParams: grd.GridParameters = {
    pattern: grd.GridPatternType.Square,
    targetWidth: imgMatrix[0].length,
    targetHeight: imgMatrix.length,
    scaleFactor: 1,
    //translateX: imgMatrix[0].length / 2,
    //translateY: imgMatrix.length / 2,
    rotationAngle: 0,
    specificParams: {wavelength: 30, amplitude: 5 },
  };

  const dotParams: dot.DotParameters = {
    shape: dot.DotType.Circle,
    sizeBinding: imgCh.Channel.Lightness,
    sizeMinThreshold: 0,
    sizeMaxThreshold: 1,
    rotationAngle: 0,
    colorCustom: false,
    color: "rgb(0, 0, 243)",
  };

  const layerParams: layerManager.LayerParameters = {
    name: "first",
    opacity: 1,
    zIndex: 0,
    baseImage: imgMatrix,
    gridParams,
    dotParams,
  };

  // TODO: Handle Promise here.
  layerManager.addLayer(svgViewport, layerParams);
  // layerManager.addLayer(svgViewport, {
  //   ...layerParams,
  //   name: "second",
  //   gridParams: {
  //     ...gridParams,
  //     rotationAngle: 15,
  //   },
  //   dotParams: {
  //     ...dotParams,
  //     shape: dot.DotType.Cross,
  //     sizeMaxThreshold: 0.5,
  //     colorCustom: true,
  //   }});
}

/**
 * Initialization Public API.
 * @public
 */

export function initialize(imageMatrix: any[][], parentNode: string,
                           width: string = widthRel, height: string = heightRel) {
  // Input image.
  imgMatrix = imageMatrix;
  imgWidth = imgMatrix[0].length;
  imgHeight = imgMatrix.length;

  // Component size.
  if (width) { widthRel = width; }
  if (height) { heightRel = height; }

  // Initialize.
  initializeSvg(parentNode);
  initializeGrid();
}
