import * as d3 from "d3";

import { DotType } from "../../../../../models/dotModel";

/**
 * Get the max area needed to cover a whole bin of size 1.
 * This is a perceptual aproximation to make shape size calibration easier.
 * @public
 * @function getMaxCoverArea
 * @param  {DotType} type: DotType {Dot shape type}
 * @return {number} {Area value}
 */
export function getMaxCoverArea(type: DotType) {
  switch (type) {
    case DotType.Circle:    return Math.PI / 2;    // a = pi * r^2
    case DotType.Square:    return 1;
    case DotType.Cross:     return 1.2;
    case DotType.Diamond:   return 1;
    case DotType.Star:      return 1;
    case DotType.Triangle:  return 1;
    case DotType.Wye:       return 1;
    default: return 1;
  }
}

/**
 * Dot Shape Factory. It creates a symbol generator to be used
 * as a SVG path.
 * @function CreateDotShape
 * @param  {DotType} type: DotType {Dot shape type}
 * @return {any} {D3 symbol generator}
 */
export function CreateDotShape(type: DotType) {
  const shapeCreator = (symbolType) => d3.symbol().type(symbolType);

  switch (type) {
    case DotType.Circle:    return shapeCreator(d3.symbolCircle);
    case DotType.Square:    return shapeCreator(d3.symbolSquare);
    case DotType.Cross:     return shapeCreator(d3.symbolCross);
    case DotType.Diamond:   return shapeCreator(d3.symbolDiamond);
    case DotType.Star:      return shapeCreator(d3.symbolStar);
    case DotType.Triangle:  return shapeCreator(d3.symbolTriangle);
    case DotType.Wye:       return shapeCreator(d3.symbolWye);
    default: return shapeCreator(d3.symbolCircle);
  }
}

