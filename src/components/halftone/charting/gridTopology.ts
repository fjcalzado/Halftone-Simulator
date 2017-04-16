import * as timer from "../../../api/timerLog";
import { AffineTransformer, CreateAffineTransformer } from "./affineTransform";
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
 * @param  {GridParameters} gridParameters: GridParameters {Set of grid configuration parameters}
 * @return {Promise<number[]>} {Promise that returns an array of nodes when resolved.}
 */
export function CreateGridTopology(gridParameters: GridParameters): Promise<number[]> {
  return new Promise<number[]>((resolve, reject) => {
    try {
      timer.reset();

      // STEP 1: First of all, lets calculate our pre-requisites. This is just
      // done for performance efficiency.

      // Target space precalculus (pixels space).
      const widthPx = gridParameters.targetWidth;
      const heightPx = gridParameters.targetHeight;
      const anchorPoint = {x: (widthPx / 2) - 0.5, y: (heightPx / 2) - 0.5};

      // Affine transformer in pixel space
      const aft = CreateAffineTransformer()
        .setupScale(gridParameters.scaleFactor)
        .setupRotate(gridParameters.rotationAngle);

      // Grid space precalculus (lines and positions space).
      const gridPattern = CreateGridPattern(gridParameters.pattern);
      const extent = calculateGridExtent(widthPx, heightPx, aft);
      const startLine = Math.floor(extent.minY * gridPattern.linesPerUnit);
      const startPosition = Math.floor(extent.minX * gridPattern.positionsPerUnit);
      const stopLine = Math.ceil(extent.maxY * gridPattern.linesPerUnit);
      const stopPosition = Math.ceil(extent.maxX * gridPattern.positionsPerUnit);

      // Filtering function to discard final points that do not overlap
      // with target area. Lets add a bit more widen margin.
      const inside = (p) => ((-0.1 <= p.x && p.x <= widthPx) && (-0.1 <= p.y && p.y <= heightPx));

      // STEP 2: Now run grid pattern generation.
      const grid = [];

      d3.range(startLine, stopLine, 1).forEach((lineIndex) => {
        const dl = gridPattern.deltaLine(lineIndex);
        d3.range(startPosition, stopPosition, 1).forEach((positionIndex) => {
          const dp = gridPattern.deltaPosition(positionIndex);

          // Calculate point and its transformed equivalent.
          const p = {
            x: dp + gridPattern.variancePosition(lineIndex, positionIndex),
            y: dl + gridPattern.varianceLine(lineIndex, positionIndex),
          };
          const tp = aft.transform(p);

          // Filter and add point to topology.
          if (inside(tp)) { grid.push(tp); }
        });
      });

      timer.logElapsed("[CreateGridTopology]");
      resolve(grid);
    } catch (e) {
      reject(e.message);
    }
  });
}

/**
 * Helper section.
 * @private
 */

function calculateGridExtent(width: number, height: number, aft: AffineTransformer) {
  // Apply inverse transformation to the 4 corners and keep the widen extent.
  const leftTop = aft.inverseTransform({x: 0, y: 0});
  const rightTop = aft.inverseTransform({x: width, y: 0});
  const leftBottom = aft.inverseTransform({x: 0, y: height});
  const rightBottom = aft.inverseTransform({x: width, y: height});

  return {
    minX: Math.min(leftTop.x, rightTop.x, leftBottom.x, rightBottom.x),
    maxX: Math.max(leftTop.x, rightTop.x, leftBottom.x, rightBottom.x),
    minY: Math.min(leftTop.y, rightTop.y, leftBottom.y, rightBottom.y),
    maxY: Math.max(leftTop.y, rightTop.y, leftBottom.y, rightBottom.y),
  };
}
