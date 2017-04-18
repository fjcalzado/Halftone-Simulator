import chroma from "chroma-js";
import * as timer from "../../../api/timerLog";
import * as imgInterpolator from "../api/imageInterpolator";
import {CreateGridTopology, GridParameters, GridPatternType,
        GridTopologyDataFiller} from "./gridTopology";
import {CreatePixelTopologyLayer} from "./pixelTopology"; // Only for testing.
const d3 = require("d3");
const styles = require("../halftoneTheme.scss");

/**
 * Module local variables.
 * @private
 */

// Input elements.
let imgMatrix: any[][] = null;

// Chart main elements.
let parentHtmlClassName: string = null;
let svgViewport = null;

// Chart scales.
let dotScale = null;

// Maximum dot radius will be binsize half diagonal.
// Applying Pitagoras we can calculate the radius factor related to binsize.
const dotRadiusFactor = (Math.sqrt(2) / 2);

// Width and Height of the component in relative units.
// Fit the container by default unless a specific relative
// size is indicated from the caller.
let widthRel = "100%";
let heightRel = "100%";
// Width and Height of the component in absolute units.
let widthAbs = null;
let heightAbs = null;

/**
 * Helper Functions
 * @private
 */

function calculateAbsoluteSize() {
  widthAbs = parseInt(svgViewport.style("width"), 10);
  heightAbs = parseInt(svgViewport.style("height"), 10);
}

/**
 * Initialization Functions
 * @private
 */

function initializeChart() {
  svgViewport = d3.select(`.${parentHtmlClassName}`)
    .append("svg")
      .attr("class", "svg-viewport")
      .attr("width", widthRel)
      .attr("height", heightRel);
  calculateAbsoluteSize();
}

function initializeScales() {
  // dotScale to determine dot area in terms of radius. We could think
  // in making use of a sqrt scale due to the area vs radius relationship.
  // However, pattern values will already come gamma-corrected or with 
  // a custom curve applied to them.
  dotScale = d3.scaleLinear()
    .domain([0, 1])  // Normalized luminance.
    .range([0, dotRadiusFactor]);
}

function initializeGrid() {
  const gridParams: GridParameters = {
    pattern: GridPatternType.Wave,
    targetWidth: imgMatrix[0].length,
    targetHeight: imgMatrix.length,
    scaleFactor: 2,
    translateX: 50,
    translateY: 0,
    rotationAngle: 0,
    specificParams: {length: 30, amplitude: 3 },
  };

  const gridContainer = svgViewport
      .attr("viewBox", `-5 -5 ${gridParams.targetWidth + 10} ${gridParams.targetHeight + 10}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
      .attr("class", "grid-container");

  let pixelLayer = null;
  // CreatePixelTopologyLayer(gridParams.targetWidth, gridParams.targetHeight, gridContainer)
  //   .then((layer) => { pixelLayer = layer; })
  //   .catch((error) => { console.error(`[ERROR] CreatingPixelTopologyLayer: ${error}`); });

  const dataFiller = imgInterpolator.CreateImageInterpolator(imgMatrix, imgInterpolator.NearestNeighbor);
  let gridLayer = null;
  CreateGridTopology(gridParams, dataFiller)
    .then((gridTopology) => {
      timer.reset();
      gridLayer = gridContainer
        .append("g")
          .attr("class", "grid-topology-layer")
        .selectAll("circle")
          .data(gridTopology)
        .enter().append("circle")
          .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
          //.attr("r", (d) => dotScale(1 - d.data[2]))
          .attr("r", dotScale(0.4))
          .attr("fill", "black" /*(d) => chroma(...d.data, "hsl").css("hsl")*/);
      timer.logElapsed("[DrawGridTopology]");
    })
    .catch((error) => { console.error(`[ERROR] CreatingGridTopologyLayer: ${error}`); });
}

/**
 * Initialization Public API.
 * @public
 */

export function initialize(imgPattern: any[][], elementId: string,
                           width: string = widthRel, height: string = heightRel) {
  parentHtmlClassName = elementId;
  imgMatrix = imgPattern;
  if (width) { widthRel = width; }
  if (height) { heightRel = height; }

  initializeChart();
  initializeScales();
  initializeGrid();
}
