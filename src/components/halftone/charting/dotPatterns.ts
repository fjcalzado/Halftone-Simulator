import * as d3 from "d3";

/**
 * Interface Export.
 * @public
 */

export enum DotShapeType {
  Circle = 1,
  Square,
  Cross,
  Diamond,
  Star,
  Triangle,
  Wye,
  // TODO: Ellipse, Heart.
}

export function CreateDotShapePath(shapeType: DotShapeType) {
  switch (shapeType) {
    case DotShapeType.Circle: return d3.symbol().type(d3.symbolDiamond).size(0.7);
    default: return d3.symbolCircle;
  }
}

