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
  rotationAngle?: number;
  scaleFactor?: number;
  translateX?: number;
  translateY?: number;
  specificParams?: any;
  /**
   * Scale factor emulates grid resolution. However, it is smarter to
   * modify input picture resolution instead of grid scale given that
   * picture rescaling will use a proper resampling algorithm.
   */
}

export type GridTopologyDataFiller = (point: {x: number, y: number}) => any;

/**
 * Grid Topology factory. It creates a new grid topology: an array
 * of nodes (in coordinate format x,y) that follows a certain lattice or pattern.
 * Optionally, each node can be assigned certain custom data based on
 * its coordinates through the handler dataFiller.
 * @public
 * @function CreateGridTopology
 * @param {GridParameters} gridParameters: GridParameters {Set of grid configuration parameters}
 * @param {GridTopologyDataFiller} dataFiller {Optional function to fill each node with custom data.}
 * @return {Promise<number[]>} {Promise that returns an array of nodes when resolved.}
 */
export function CreateGridTopology(gridParameters: GridParameters,
                                   dataFiller?: GridTopologyDataFiller): Promise<any[]> {
  return new Promise<any[]>((resolve, reject) => {
    try {
      timer.reset();

      // STEP 1: First of all, lets calculate our pre-requisites. This is just
      // done for performance efficiency.

      // Target space precalculus (pixels space).
      const widthPx = gridParameters.targetWidth;
      const heightPx = gridParameters.targetHeight;
      // const anchorPoint = {x: (widthPx / 2) - 0.5, y: (heightPx / 2) - 0.5};

      // Affine transformer in pixel space
      const aft = CreateAffineTransformer()
        .setupScale(gridParameters.hasOwnProperty("scaleFactor") ? gridParameters.scaleFactor : 1)
        .setupRotate(gridParameters.hasOwnProperty("rotationAngle") ? gridParameters.rotationAngle : 0)
        .setupTranslate(gridParameters.hasOwnProperty("translateX") ? gridParameters.translateX : 0,
                        gridParameters.hasOwnProperty("translateY") ? gridParameters.translateY : 0);

      // Grid space precalculus (lines and positions space).
      const gridPattern = CreateGridPattern(gridParameters.pattern, gridParameters.specificParams);
      const extent = calculateGridExtent(widthPx, heightPx, aft);
      const lrange = gridPattern.getLineRange(extent.minY, extent.maxY);
      const prange = gridPattern.getPositionRange(extent.minX, extent.maxX);
      const startLine = lrange.minLine;
      const stopLine = lrange.maxLine;
      const startPosition = prange.minPos;
      const stopPosition = prange.maxPos;

      // Filtering function to discard final points that do not overlap
      // with target area.
      // THIS IS VERY IMPORTANT TO AVOID SERIOUS PROBLEMS OF UNDEFINED ACCESS.
      const marginPx = 0.5;
      const inside = (p) => (((marginPx <= p.x) && (p.x <= widthPx - marginPx) &&
                             ((marginPx <= p.y) && (p.y <= heightPx - marginPx))));

      // STEP 2: Now run grid pattern generation.
      const grid = [];

      d3.range(startLine, stopLine, 1).forEach((lineIndex) => {
        const dl = gridPattern.deltaLine(lineIndex);
        d3.range(startPosition, stopPosition, 1).forEach((positionIndex) => {
          const dp = gridPattern.deltaPosition(positionIndex);

          // Calculate point and its transformed equivalent.
          const vp = gridPattern.variancePosition(lineIndex, positionIndex);
          const vl = gridPattern.varianceLine(lineIndex, positionIndex);
          if (vp === null || vl === null) { return; } // Used in some patterns to skip once reached certain position.
          const p = {
            x: dp + vp,
            y: dl + vl,
          };
          let tp = aft.transform(p);

          // Filter points outside the target pixel-space area.
          if (inside(tp)) {
            // Finally fill with custom data if handler is available.
            if (dataFiller) {
              const data = dataFiller(tp);
              if (data) { tp = {...tp, data}; }
              else { return; }
            }
            grid.push(tp);
          }
        });
      });

      timer.logElapsed("[CreateGridTopology]");
      resolve(grid);
    } catch (error) {
      reject(error.message);
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
