import chroma from "chroma-js";
import * as d3 from "d3";

import {CreateTimer} from "../../../api-utils";
import * as img from "../imaging";
import * as dot from "./dotTopology";
import * as grd from "./gridTopology";
import * as layerManager from "./layerManager";
const styles = require("../halftoneTheme.scss");


/**
 * Local state.
 * @private
 */

// Svg main elements.
let svg = null;
let svgViewport = null;

// Width and Height of the svg component in relative units.
// Fit its parent by default unless a specific relative
// size is indicated from the caller.
let widthRel = "100%";
let heightRel = "100%";

// Input image.
 let srcImage: any[][] = null

/**
 * Initialization public API. Provide a source image, a container or
 * parent node to hold the svg element as well as its width/height in
 * relative units.
 * @public
 * @function initialize
 * @param  {string} parentNode: string {Parent node to append SVG element to.}
 * @param  {string} width: string {Width of the SVG element in relative units.}
 * @param  {string} height: string {Height of the SVG element in relative units.}
 * @return {void}
 */
export function initialize(parentNode: string, width: string = widthRel, height: string = heightRel): void {
  // Component size.
  if (width) { widthRel = width; }
  if (height) { heightRel = height; }

  // Initialize SVG element.
  svg = d3.select(`.${parentNode}`)
    .append("svg")
      .attr("class", "svg")
      .attr("width", widthRel)
      .attr("height", heightRel)
      .attr("viewBox", `0 0 0 0`)
      .attr("preserveAspectRatio", "xMidYMid meet");
  svgViewport = svg.append("g")
      .attr("class", "svg-viewport");
}

/**
 * Set a new image to be drawn.
 * @public
 * @function setImage
 * @param  {type} sourceImage: any[][] {Source Image.}
 * @return {void}
 */
export function setImage(sourceImage: any[][]): void {
  // Clear layers and reset previous state.
  layerManager.clearLayers(svgViewport);
  layerManager.resetState();

  // Store Input image.
  srcImage = sourceImage;
  const srcImgWidth = srcImage[0].length;
  const srcImgHeight = srcImage.length;

  // Configure SVG Viewport based on new image dimensions.
  svg.attr("viewBox", `-1 -1 ${srcImgWidth + 2} ${srcImgHeight + 2}`);
}

/**
 * Draw halftone pattern for a given a set of layer parameters.
 * @public
 * @function draw
 * @param  {LayerStack} layers: LayerStack {Stack of layers described by its parameters.}
 * @return {Promise<boolean>} {Promise indicating if operation was succesfully completed.}
 */
export function draw(layers: layerManager.LayerStack): Promise<boolean> {
  return layerManager.drawLayers(svgViewport, srcImage, layers);
}



















// To be removed, just for testing.
export function simulateLayerDrawing() {

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
  draw(layerStack1)
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
