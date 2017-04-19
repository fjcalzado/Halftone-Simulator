import * as d3 from "d3";
import * as imgCh from "../api/imageChannelExtractor";
import * as dotp from "./dotPatterns";


/**
 * Interface Export.
 * @public
 */

import {DotShapeType} from "./dotPatterns";
export {DotShapeType};

export enum DotColorBinding {
  Original,
  Custom,
}

export interface DotParameters {
  shape: DotShapeType;
  bindSizeTo: imgCh.Channel;
  sizeMinThreshold: number;
  sizeMaxThreshold: number;
  rotationAngle: number;
  colorBinding: DotColorBinding;
}

export interface DotTopology {
  readonly getPath: () => any;
}



export function CreateDotTopology(dotParameters: DotParameters): DotTopology {
  const path = dotp.CreateDotShapePath(dotParameters.shape);

  const dotTopology: DotTopology = {
    getPath: () => path,
  };
  return dotTopology;
}
