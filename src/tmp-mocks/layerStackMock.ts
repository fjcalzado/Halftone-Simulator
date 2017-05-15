

// ***********************************************************************
// To be removed, just for testing.
// ***********************************************************************

import { Channel } from "../models/channelModel";
import { DotType, DotParameters } from "../models/dotModel";
import { GridPatternType, GridParameters } from "../models/gridModel";
import { LayerParameters, LayerStack } from "../models/layerModel";

export function GenerateSampleLayerStack(width, height): LayerStack {

  const gridParams: GridParameters = {
    pattern: GridPatternType.Square,
    targetWidth: width,
    targetHeight: height,
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
    name: "main",
    opacity: 1,
    zIndex: 0,
    gridParams,
    dotParams,
  };

  const layerStack1: LayerStack = [
    layerParams,
    // { ...layerParams,
    //   name: "crossblue",
    //   zIndex: 1,
    //   gridParams: {
    //     ...gridParams,
    //     rotationAngle: 15,
    //   },
    //   dotParams: {
    //     ...dotParams,
    //     shape: DotType.Cross,
    //     sizeMaxThreshold: 0.5,
    //     colorCustom: true,
    //   },
    // },
  ];

  return layerStack1;
}


// ***********************************************************************