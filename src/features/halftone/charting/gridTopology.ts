import * as d3 from "d3";

import { CreateTimer } from "../../../util";
import { AffineTransformer, CreateAffineTransformer } from "./affineTransform";
import { GridNode, GridPatternType, GridParameters } from "../../../models/gridModel";
import { CreateGridPattern } from "./gridPatterns";

/**
 * Interface Export. Internal to component.
 * @public
 */

export type GridTopologyRGBFiller = (point: {x: number, y: number}) => number[];
export type GridTopology = GridNode[];


/**
 * Grid Topology factory. It creates a new grid topology: an array
 * of nodes (in coordinate format x,y) that follows a certain lattice or pattern.
 * Optionally, each node can be assigned RGB data based on
 * its coordinates through the handler rgbFiller.
 * @public
 * @function CreateGridTopology
 * @param {GridParameters} gridParameters: GridParameters {Set of grid configuration parameters}
 * @param {number} targetWidth {Target image width in pixels.}
 * @param {number} targetHeight {Target image height in pixels.}
 * @param {GridTopologyRGBFiller} rgbFiller {Optional function to fill each node with RGB data.}
 * @return {Promise<GridTopology>} {Promise that returns a grid topology (array of nodes) when resolved.}
 */
export function CreateGridTopology(gridParameters: GridParameters,
                                   targetWidth: number, targetHeight: number,
                                   rgbFiller?: GridTopologyRGBFiller): Promise<GridTopology> {
  return new Promise<GridTopology>((resolve, reject) => {
    try {
      const timer = CreateTimer();

      // STEP 1: First of all, lets calculate our pre-requisites. This is just
      // done for performance efficiency.

      // Target space precalculus (pixels space).
      const widthPx = targetWidth;
      const heightPx = targetHeight;
      // const anchorPoint = {x: (widthPx / 2) - 0.5, y: (heightPx / 2) - 0.5};

      // Affine transformer in pixel space
      const aft = CreateAffineTransformer()
        .setupScale(gridParameters.hasOwnProperty("scaleFactor") ? gridParameters.scaleFactor : 1)
        .setupRotate(gridParameters.hasOwnProperty("rotationAngle") ? gridParameters.rotationAngle : 0)
        .setupTranslate(gridParameters.hasOwnProperty("translateX") ? gridParameters.translateX : 0,
                        gridParameters.hasOwnProperty("translateY") ? gridParameters.translateY : 0);

      // Grid space precalculus (lines and positions space).
      const gridPattern = CreateGridPattern(gridParameters.pattern, gridParameters.specificParams);
      const extentPxSpace = calculateGridExtent(widthPx, heightPx, aft);
      const extentPatternSpace = gridPattern.getExtent(extentPxSpace.minY, extentPxSpace.maxY,
                                                       extentPxSpace.minX, extentPxSpace.maxX);
      const startLine = extentPatternSpace.minLine;
      const stopLine = extentPatternSpace.maxLine;
      const startPosition = extentPatternSpace.minPos;
      const stopPosition = extentPatternSpace.maxPos;

      // Filtering function to discard final points that do not overlap
      // with target area.
      // THIS IS VERY IMPORTANT TO AVOID SERIOUS PROBLEMS OF UNDEFINED ACCESS.
      const marginPx = 1; // Remove 1 row/column of pixels in each side to be safe for interpolators.
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
          let node: GridNode = aft.transform(p);

          // Filter points outside the target pixel-space area.
          if (inside(node)) {
            // Finally fill with RGB data if handler is available.
            if (rgbFiller) {
              const rgb = rgbFiller(node);
              if (rgb) { node = {...node, rgb}; }
              else { return; }
            }
            grid.push(node);
          }
        });
      });

      timer.logElapsed("[Create Grid Topology]");
      resolve(grid);
    } catch (error) {
      reject(error);
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
