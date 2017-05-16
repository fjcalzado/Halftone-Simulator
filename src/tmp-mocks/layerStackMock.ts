
// ***********************************************************************
// To be removed, just for testing.
// ***********************************************************************

import { Channel } from "../models/channelModel";
import { DotType, DotParameters } from "../models/dotModel";
import { GridPatternType, GridParameters } from "../models/gridModel";
import { LayerParameters, LayerStack } from "../models/layerModel";

const gridParams: GridParameters = {
  pattern: GridPatternType.Square,
  scaleFactor: 1,
  rotationAngle: 0,
  specificParams: {wavelength: 30, amplitude: 5 },
};

const dotParams: DotParameters = {
  shape: DotType.Circle,
  sizeBinding: Channel.Lightness,
  sizeMinThreshold: 0,
  sizeMaxThreshold: 1,
  rotationAngle: 0,
  colorCustom: false,
  color: "rgb(0, 0, 243)",
};

const layerParams: LayerParameters = {
    name: "Single Layer",
    opacity: 1,
    zIndex: 0,
    gridParams,
    dotParams,
};

export const simpleLayerStack: LayerStack = [layerParams];

export const multiLayerStack: LayerStack = [
  {
    ...layerParams,
    name: "First Layer",
    zIndex: 0,
  },
  {
    ...layerParams,
    name: "Second Layer",
    zIndex: 1,
  },
  {
    ...layerParams,
    name: "Third Layer",
    zIndex: 2,
  },
];


// ***********************************************************************