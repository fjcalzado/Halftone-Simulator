const d3 = require("d3");
const styles = require("./halftoneTheme.scss")

/**
 * Module local variables.
 * @private
 */

// Chart main elements.
let htmlId = null;
let pattern = null;
let svg = null;
let svgCanvas = null;
let dotSelection = null;

// Chart scales.
let xScale = null;
let yScale = null;
let dotScale = null;

// Width and Height in relative units.
// Fit the container by default unless a specific relative
// size is indicated from the caller.
let widthRel = "100%";
let heightRel = "100%";
// Width and Height in absolute units.
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
  svgCanvas = svg
    .append("g");
}

export function initializeScales() {
  const xRes = pattern[0].length;
  const yRes = pattern.length;

 // x Scale - x position of the dot. Columns.
  xScale = d3.scalePoint()
    .domain(d3.range(0, xRes - 1, 1))
    .range([0, widthAbs - 1]);

  // y Scale - y position of the dot. Rows.
  yScale = d3.scalePoint()
    .domain(d3.range(0, yRes - 1, 1))
    .range([0, heightAbs - 1]);

  // Adjust padding to either X or Y scale to keep aspect ratio (squared bins).
  const aRatioDiff = xScale.step() - yScale.step();
  if (aRatioDiff < 0) {
    // Y bin size is bigger than X. Add padding to Y.
    yScale = yScale.padding((-1 * aRatioDiff * (yRes - 1)) / heightAbs);
  } else {
    // X bin size is bigger than Y. Add padding to X.
    xScale = xScale.padding((aRatioDiff * (xRes - 1)) / widthAbs);
  }

  // dotScale - dot radius lenght.
  const dotBinSizeAbs = Math.min(xScale.step(), yScale.step());
  dotScale = d3.scaleLinear()
    .domain([0, 1])  // Normalized luminance.
    .rangeRound([0, Math.sqrt(2) * dotBinSizeAbs / 2]);
}

export function initializeSelection() {
  dotSelection = svgCanvas.selectAll("g")   // Row representation.
      .data(pattern)
    .enter().append("g")
      .selectAll("circle")
      .data((d, i) => d)      // d is a pattern[i], a row.
    .enter().append("circle")
      .attr("cx", (d, i) => xScale(i))
      .attr("cy", (d, i) => yScale(i))
      .attr("r", (d) => dotScale(d))
      .attr("class", styles.dot);
}
