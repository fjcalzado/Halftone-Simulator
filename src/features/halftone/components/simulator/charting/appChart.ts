import * as d3 from "d3";

import { identifiers } from "../../../../../identifiers";
import { CreateTimer } from "../../../../../util";
import { LayerStack } from "../../../../../models/layerModel";
import * as layerManager from "./layerManager";


/**
 * Local state.
 * @private
 */

// Svg main elements.
let svg = null;
let svgViewport = null;
let svgBackground = null;

// Width and Height of the svg component in relative units.
// Fit its parent by default unless a specific relative
// size is indicated from the caller.
let widthRel = "100%";
let heightRel = "100%";

// Input image.
let srcImage: any[][] = null;

/**
 * Initialization public API. Provide a source image, a container or
 * parent node to hold the svg element as well as its width/height in
 * relative units.
 * @public
 * @function initialize
 * @param  {any} parentNode: string {Parent node to append SVG element to.}
 * @param  {string} height: string {Height of the SVG element in relative units.}
 * @return {void}
 */
export function initialize(parentNode: any, width: string = widthRel, height: string = heightRel): void {
  // Component size.
  if (width) { widthRel = width; }
  if (height) { heightRel = height; }

  // Initialize SVG element.
  svg = d3.select(parentNode)
    .append("svg")
      .attr("id", identifiers.svgNodeId)
      .attr("class", "svg")
      .attr("width", widthRel)
      .attr("height", heightRel)
      .attr("viewBox", `0 0 0 0`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("version", "1.1")
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
  svgViewport = svg.append("g")
      .attr("id", identifiers.svgViewportId)
      .attr("class", "viewport");
  svgBackground = svgViewport.append("rect")
      .attr("class", "svg-background")
      .attr("fill", "rgba(255, 255, 255, 1)")
      .attr("opacity", 0)
      .attr("x", 0).attr("y", 0);
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

  // Configure SVG Viewport and SVG Background based on
  // new image dimensions.
  svg.attr("viewBox", `0 0 ${srcImgWidth} ${srcImgHeight}`);
  svgBackground.attr("width", srcImgWidth).attr("height", srcImgHeight);
}

/**
 * Set a background color for our viewport.
 * @function setBackgroundColor
 * @param  {boolean} enable {Enable/Disable background color}
 * @param  {any} color {Color in CSS or number format}
 * @return {void}
 */
export function setBackgroundColor(enable: boolean, color: any): void {
  svgBackground.attr("fill", color).attr("opacity", enable ? 1 : 0);
}

/**
 * Draw halftone pattern for a given a set of layer parameters.
 * @public
 * @function draw
 * @param  {LayerStack} layers: LayerStack {Stack of layers described by its parameters.}
 * @return {Promise<boolean>} {Promise indicating if operation was succesfully completed.}
 */
export function draw(layers: LayerStack): Promise<boolean> {
  return new Promise<boolean>(
    (resolve, reject) => {
      try {
        layerManager.drawLayers(svgViewport, srcImage, layers)
        .then((result) => {
          // layerManager.reportLayerDOMStatus(svgViewport);
          resolve(result);
        })
        .catch((error) => {
          console.error(`[ERROR] Drawing Layers: ${error.message}`);
          throw error;  // Let error bubbles up.
        });
      } catch (error) {
        reject(error);
      }
  });
}
