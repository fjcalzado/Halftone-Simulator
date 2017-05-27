
// ***********************************************************************
// To be removed, just for testing.
// ***********************************************************************

import { Channel } from "../models/channelModel";
import { DotType, DotParameters, CreateDefaultDotParams } from "../models/dotModel";
import { GridPatternType, GridParameters, CreateDefaultGridParams } from "../models/gridModel";
import { LayerParameters, LayerStack } from "../models/layerModel";

const gridParams: GridParameters = CreateDefaultGridParams();

const dotParams: DotParameters = CreateDefaultDotParams();

const layerParams: LayerParameters = {
    name: "Single Layer",
    visible: true,
    opacity: 1,
    zIndex: 0,
    gridParams,
    dotParams,
};

export const simpleLayerStack: LayerStack = [layerParams];

export const multiLayerStack: LayerStack = [
  {
    ...layerParams,
    name: "firstlayer",
    zIndex: 0,
  },
  {
    ...layerParams,
    name: "secondlayer",
    zIndex: 1,
  },
  {
    ...layerParams,
    name: "AnotherOne",
    zIndex: 2,
  },
];


// ***********************************************************************