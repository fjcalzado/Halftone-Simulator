import {GridPattern, GridPatternTypes, getGridPattern} from "./gridPatterns";
const d3 = require("d3");

export {GridPatternTypes};

export interface GridParameters {
  pattern: GridPatternTypes;
  targetWidth: number;
  targetHeight: number;
  rotationAngle?: number;
  densityFactor?: number;
  /**
   * Density factor emulates grid resolution. However, it is smarter to
   * modify input picture resolution instead of grid density given that
   * picture rescaling will use a proper resampling algorithm.
   */
}

export function CreateGridTopology(gridParameters: GridParameters): number[] {

  const gridPattern = getGridPattern(gridParameters.pattern);
  const densF = gridParameters.densityFactor / 100;
  const widthPx = gridParameters.targetWidth;
  const heightPx = gridParameters.targetHeight;

  const linesCount = widthPx * densF * gridPattern.linesPerPxFactor(heightPx);
  const positionCount = heightPx * densF * gridPattern.positionsPerPxFactor(widthPx);

  const grid = [];

  d3.range(0, linesCount, 1).forEach((lineIndex) => {
    const dl = gridPattern.deltaLine(lineIndex);
    d3.range(0, positionCount, 1).forEach((positionIndex) => {
      const dp = gridPattern.deltaPosition(positionIndex);
      let x = dp + gridPattern.variancePosition(lineIndex, positionIndex);
      let y = dl + gridPattern.varianceLine(lineIndex, positionIndex);
      if (densF !== 1) {
        x /= densF;
        y /= densF;
      }
      grid.push({x, y});
    });
  });

  return grid;
}

// Only for testing purposes.
export function appendPixelPatternChecker(width: number, height: number, selection): void {
  const gridParams: GridParameters = {
    targetWidth: width,
    targetHeight: height,
    densityFactor: 100,
    rotationAngle: 0,
    pattern: GridPatternTypes.Square,
  };

  const pixelLayer = selection.append("g")
      .attr("class", "pixel-layer")
      .attr("transform", `translate(-0.5, -0.5)`)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", "0.025px");

  pixelLayer
  .selectAll("polyline")
    .data(CreateGridTopology(gridParams))
  .enter().append("polyline")
    .attr("points", (d) => `${d.x} ${d.y + 1}, ${d.x} ${d.y}, ${d.x + 1} ${d.y}`);

  pixelLayer.append("polyline")
    .attr("points", `0 ${height}, ${width} ${height}, ${width} 0`);

  return pixelLayer;
}
