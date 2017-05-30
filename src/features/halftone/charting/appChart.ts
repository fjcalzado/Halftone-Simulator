import chroma from "chroma-js";
import * as d3 from "d3";

import { CreateTimer } from "../../../util";
import { LayerStack } from "../../../models/layerModel";
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
 * @param  {string} parentNode: string {Parent node ID to append SVG element to.}
 * @param  {string} width: string {Width of the SVG element in relative units.}
 * @param  {string} height: string {Height of the SVG element in relative units.}
 * @return {void}
 */
export function initialize(parentNodeId: string, width: string = widthRel, height: string = heightRel): void {
  // Component size.
  if (width) { widthRel = width; }
  if (height) { heightRel = height; }

  // Initialize SVG element.
  svg = d3.select(`#${parentNodeId}`)
    .append("svg")
      .attr("class", "svg")
      .attr("width", widthRel)
      .attr("height", heightRel)
      .attr("viewBox", `0 0 0 0`)
      .attr("preserveAspectRatio", "xMidYMid meet");
  svgViewport = svg.append("g")
      .attr("class", "svg-viewport");
  svgBackground = svgViewport.append("rect")
      .attr("class", "svg-background")
      .attr("fill", "rgba(255, 255, 255, 0)")
      .attr("x", 1).attr("y", 1);
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

  // Configure SVG Viewport adn SVG Background based on
  // new image dimensions.
  svg.attr("viewBox", `-1 -1 ${srcImgWidth + 2} ${srcImgHeight + 2}`);
  svgBackground.attr("width", srcImgWidth - 2).attr("height", srcImgHeight - 2);
}

/**
 * Set a background color for our viewport.
 * @function setBackgroundColor
 * @param  {any} color {Color in CSS or number format}
 * @return {void}
 */
export function setBackgroundColor(color): void {
  svgViewport.attr("fill", color);
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
          layerManager.reportLayerDOMStatus(svgViewport);
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
