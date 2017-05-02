import chroma from "chroma-js";
import * as d3 from "d3";

import {CreateTimer} from "../../../api-utils";
import * as img from "../imaging";
import * as dot from "./dotTopology";
import * as grd from "./gridTopology";
import * as layerManager from "./layerManager";
const styles = require("../halftoneTheme.scss");


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
    name: "main",
    opacity: 1,
    zIndex: 0,
    gridParams,
    dotParams,
  };

  const layerStack1: layerManager.LayerStack = [
    layerParams,
    // { ...layerParams,
    //   name: "crossblue",
    //   zIndex: 1,
    //   gridParams: {
    //     ...gridParams,
    //     rotationAngle: 15,
    //   },
    //   dotParams: {
    //     ...dotParams,
    //     shape: dot.DotType.Cross,
    //     sizeMaxThreshold: 0.5,
    //     colorCustom: true,
    //   },
    // },
  ];

  // TODO: Handle Promise here.
  layerManager.draw(svgViewport, srcImage, layerStack1)
    .then((result) => layerManager.reportLayerDOMStatus(svgViewport));

  // const layerStack2 = layerStack1.slice(0);
  // layerStack2[0].dotParams.shape = dot.DotType.Square;
  // layerStack2[1].zIndex = -1;

  // setTimeout(() => {
  //   layerManager.draw(svgViewport, srcImage, layerStack2)
  //   .then((result) => layerManager.reportLayerDOMStatus(svgViewport));
  // }, 6000);

  // const layerStack2 = layerStack1.map((item, i) => ({...item, zIndex: 1 - i}));
  // setTimeout(() => {
  //   layerManager.draw(svgViewport, srcImage, layerStack2)
  //   .then((result) => layerManager.reportLayerDOMStatus(svgViewport));
  // }, 4000);

  // const layerStack3 = [{...layerParams, dotParams: {...dotParams, shape: dot.DotType.Square }}];
  // setTimeout(() => {
  //   layerManager.draw(svgViewport, srcImage, layerStack3)
  //   .then((result) => layerManager.reportLayerDOMStatus(svgViewport));
  // }, 4000);



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
