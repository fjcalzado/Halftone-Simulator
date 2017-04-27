import chroma from "chroma-js";
import * as d3 from "d3";

import * as timer from "../../../api";
import * as img from "../imaging";
import * as dot from "./dotTopology";
import * as grd from "./gridTopology";
import * as layerManager from "./layerManager";
const styles = require("../halftoneTheme.scss");

// Only for testing.
//import { AddPixelTopologyLayer } from "./pixelTopology";

/**
 * Module local variables.
 * @private
 */

// Input elements.
let srcImage: any[][] = null;
let srcImgWidth: number = 0;
let srcImgHeight: number = 0;

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
      .attr("viewBox", `-1 -1 ${srcImgWidth + 2} ${srcImgHeight + 2}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
      .attr("class", "svg-viewport");
}

function initializeGrid() {

  const gridParams: grd.GridParameters = {
    pattern: grd.GridPatternType.Square,
    targetWidth: srcImage[0].length,
    targetHeight: srcImage.length,
    scaleFactor: 1,
    //translateX: imgMatrix[0].length / 2,
    //translateY: imgMatrix.length / 2,
    rotationAngle: 0,
    specificParams: {wavelength: 30, amplitude: 5 },
  };

  const dotParams: dot.DotParameters = {
    shape: dot.DotType.Circle,
    sizeBinding: img.Channel.Lightness,
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
    sourceImage: srcImage,
    gridParams,
    dotParams,
  };

  // TODO: Handle Promise here.
  layerManager.addLayer(svgViewport, layerParams)
    .then((result) => layerManager.updateLayerName(svgViewport, "first", "first-renamed"));
  layerManager.addLayer(svgViewport, {
    ...layerParams,
    name: "second",
    gridParams: {
      ...gridParams,
      rotationAngle: 15,
    },
    dotParams: {
      ...dotParams,
      shape: dot.DotType.Cross,
      sizeMaxThreshold: 0.5,
      colorCustom: true,
    }}).then((result) => layerManager.removeLayer(svgViewport, "second"));


  // AddPixelTopologyLayer(gridParams.targetWidth, gridParams.targetHeight, svgViewport);
}

/**
 * Initialization Public API.
 * @public
 */

export function initialize(sourceImage: any[][], parentNode: string,
                           width: string = widthRel, height: string = heightRel) {
  // Input image.
  srcImage = sourceImage;
  srcImgWidth = srcImage[0].length;
  srcImgHeight = srcImage.length;

  // Component size.
  if (width) { widthRel = width; }
  if (height) { heightRel = height; }

  // Initialize.
  initializeSvg(parentNode);
  initializeGrid();
}
