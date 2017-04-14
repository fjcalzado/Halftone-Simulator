import {GridPattern, GridPatternTypes, getGridPattern} from "./gridPatterns";
const d3 = require("d3");

export {GridPatternTypes};

export interface GridParameters {
  width: number;
  height: number;
  resolutionFactor: number;
  rotationAngle: number;
  pattern: GridPatternTypes;
}

export function CreateGridTopology(gridParameters: GridParameters): number[] {

  const gridPattern = getGridPattern(gridParameters.pattern);
  const linesCount = gridParameters.height;
  const positionCount = gridParameters.width;
  const resF = gridParameters.resolutionFactor / 100;
  const grid = [];

  d3.range(0, linesCount, 1).forEach((lineIndex) => {
    const dl = gridPattern.deltaLine(lineIndex);
    d3.range(0, positionCount, 1).forEach((positionIndex) => {
      const dp = gridPattern.deltaPosition(positionIndex);
      let x = dp + gridPattern.variancePosition(lineIndex, positionIndex);
      let y = dl + gridPattern.varianceLine(lineIndex, positionIndex);
      grid.push({x, y});
    });
  });

  return grid;
}
