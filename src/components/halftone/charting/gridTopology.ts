import { CreateAffineTransformer } from "./affineTransform";
import { CreateGridPattern, GridPattern, GridPatternType } from "./gridPatterns";

const d3 = require("d3");

/**
 * Interface Export.
 * @public
 */
export {GridPatternType};

export interface GridParameters {
  pattern: GridPatternType;
  targetWidth: number;
  targetHeight: number;
  rotationAngle: number;
  scaleFactor: number;
  /**
   * Scale factor emulates grid resolution. However, it is smarter to
   * modify input picture resolution instead of grid scale given that
   * picture rescaling will use a proper resampling algorithm.
   */
}

/**
 * Grid Topology factory. It creates a new grid topology: an array
 * of nodes (in format x,y) that follows a certain lattice or pattern.
 * @public
 * @function CreateGridTopology
 * @param  {GridParameters} gridParameters: GridParameters {description}
 * @return {number[]} {array of nodes}
 */
export function CreateGridTopology(gridParameters: GridParameters): number[] {

  // STEP 1: First of all, lets calculate our pre-requisites. This is just
  // done for performance efficiency.

  // Target space precalculus (pixels space).
  const widthPx = gridParameters.targetWidth;
  const heightPx = gridParameters.targetHeight;
  const centerPoint = {x: (widthPx / 2) - 0.5, y: (heightPx / 2) - 0.5};

  // Affine transformer in pixel space
  const aft = CreateAffineTransformer()
    .setupScale(gridParameters.scaleFactor, centerPoint)
    .setupRotate(gridParameters.rotationAngle, centerPoint);

  // Grid space precalculus (lines and positions space).
  const gridPattern = CreateGridPattern(gridParameters.pattern);
  // const startLine = 0;
  // const startPosition = 0;
  // const linesCount = heightPx * gridPattern.linesPerUnit / gridParameters.scaleFactor;
  // const positionCount = widthPx * gridPattern.positionsPerUnit / gridParameters.scaleFactor;


  const leftTop = aft.transform({x: 0, y: 0});
  const rightTop = aft.transform({x: widthPx, y: 0});
  const leftBottom = aft.transform({x: 0, y: heightPx});
  const rightBottom = aft.transform({x: widthPx, y: heightPx});

  const minX = Math.min(leftTop.x, rightTop.x, leftBottom.x, rightBottom.x);
  const maxX = Math.max(leftTop.x, rightTop.x, leftBottom.x, rightBottom.x);
  const minY = Math.min(leftTop.y, rightTop.y, leftBottom.y, rightBottom.y);
  const maxY = Math.max(leftTop.y, rightTop.y, leftBottom.y, rightBottom.y);

  const spanX = maxX - minX;
  const spanY = maxY - minY;

  const linesCount = Math.ceil(spanY * gridPattern.linesPerUnit);
  const positionCount = Math.ceil(spanX * gridPattern.positionsPerUnit);
  const startLine = Math.floor(gridPattern.initialLine + minY * gridPattern.linesPerUnit);
  const startPosition = Math.floor(gridPattern.initialPosition + minX * gridPattern.positionsPerUnit);

  // STEP 2: Now run grid pattern generation.
  const grid = [];

  d3.range(0, linesCount, 1).forEach((lineIndex) => {
    const dl = gridPattern.deltaLine(lineIndex);
    d3.range(0, positionCount, 1).forEach((positionIndex) => {
      const dp = gridPattern.deltaPosition(positionIndex);

      const x = dp + gridPattern.variancePosition(lineIndex, positionIndex);
      const y = dl + gridPattern.varianceLine(lineIndex, positionIndex);

      //if ((0 <= x && x <= widthPx) && (0 <= y && y <= heightPx)) {
        grid.push( aft.transform({x, y}) );
      //}
    });
  });

  return grid;
}

function calculateGridExtent() {

}