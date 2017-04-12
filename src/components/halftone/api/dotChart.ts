const d3 = require("d3");
const styles = require("../halftoneTheme.scss");

/**
 * Module local variables.
 * @private
 */

// Input pattern elements.
let pattern = null;
let xRes = null;
let yRes = null;

// Chart main elements.
let htmlId = null;
let svg = null;
let svgCanvas = null;

// Chart scales.
let xScale = null;
let yScale = null;
let dotScale = null;

// Maximum dot radius will be binsize half diagonal.
  // Applying Pitagoras we can calculate the radius factor related to binsize.
  const dotRadiusFactor = (Math.sqrt(2) / 2);

// Width and Height in relative units.
// Fit the container by default unless a specific relative
// size is indicated from the caller.
let widthRel = "100%";
let heightRel = "100%";
// Width and Height in absolute units.
let widthAbs = null;
let heightAbs = null;
// Width and Height adjusted by aspect ratio in absolute units.
let widthAdj = null;
let heightAdj = null;

/**
 * Helper Functions
 * @private
 */

function calculateAbsoluteSize() {
  widthAbs = parseInt(svg.style("width"), 10);
  heightAbs = parseInt(svg.style("height"), 10);
}

function adjustToFitAspectRatio() {
  // Pattern aspect ratio.
  xRes = pattern[0].length;
  yRes = pattern.length;
  const radiusExcess = dotRadiusFactor - 0.5; // Dot radiuss overpass in a bin.
  const patternAR = (xRes + (radiusExcess * 2)) / (yRes + (radiusExcess * 2));

  // SVG aspect ratio.
  const svgAR = widthAbs / heightAbs;

  // Adjust SVG size to fit pattern aspect ratio.
  if (patternAR >= svgAR) {
    // Adjust height.
    heightAdj = widthAbs / patternAR;
    widthAdj = widthAbs;
  } else {
    // Adjust width.
    widthAdj = heightAbs * patternAR;
    heightAdj = heightAbs;
  }
}

/**
 * Initialization Functions
 * @private
 */

export function initialize(elementId, imgPattern, width = widthRel, height = heightRel) {
  htmlId = elementId;
  pattern = imgPattern;
  if (width) { widthRel = width; }
  if (height) { heightRel = height; }
}

export function initializeChart() {
  svg = d3.select(`.${htmlId}`)
    .append("svg")
      .attr("width", widthRel)
      .attr("height", heightRel);
  calculateAbsoluteSize();
  adjustToFitAspectRatio();
  svgCanvas = svg
    .append("g")
      .attr("class", "aspect-ratio-container")
      .attr("transform", `translate(${(widthAbs - widthAdj) / 2},
            ${(heightAbs - heightAdj) / 2})`);
}

export function initializeScales() {
  // x Scale - x position of the dot. Columns.
  xScale = d3.scalePoint()
    .domain(d3.range(0, xRes, 1))
    .range([0, widthAdj - 1])
    .padding(dotRadiusFactor); // Padding**

  // y Scale - y position of the dot. Rows.
  yScale = d3.scalePoint()
    .domain(d3.range(0, yRes, 1))
    .range([0, heightAdj - 1])
    .padding(dotRadiusFactor); // Padding**

  // **Add an extra padding equal to maximum dot radius.
  // Remember that padding is expressed normalized ([0..1]) representing the
  // percentage of step to be left blank for padding.

  // dotScale to determine dot radius length.
  const dotBinSizeAbs = Math.min(xScale.step(), yScale.step());
  dotScale = d3.scaleLinear()
    .domain([0, 1])  // Normalized luminance.
    .rangeRound([0, dotRadiusFactor * dotBinSizeAbs]);
}

export function initializeSelection() {
  initializeRows();
}

function initializeRows() {
  svgCanvas.selectAll("g")   // Row representation.
      .data(pattern)
    .enter().append("g")
      .attr("row", (d, i) => i)
      .each(initializeDots);
}

function initializeDots(row, rowIndex) {
  d3.select(this).selectAll("circle")
      .data(row)                    // d is a pattern[i], a row.
    .enter().append("circle")
      .attr("cx", (d, i) => xScale(i))
      .attr("cy", yScale(rowIndex))
      .attr("r", (d) => dotScale(d))
      .attr("class", styles.dot);
}
