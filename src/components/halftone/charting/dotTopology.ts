import * as chroma from "chroma-js";
import * as d3 from "d3";
import * as imgCh from "../api/imageChannelExtractor";
import * as dotp from "./dotPatterns";
import { GridNode } from "./gridTopology";


/**
 * Interface Export.
 * @public
 */

import {DotType} from "./dotPatterns";
export {DotType};

export interface DotParameters {
  shape: DotType;
  sizeBinding: imgCh.Channel;
  sizeMinThreshold: number;
  sizeMaxThreshold: number;
  rotationAngle: number;
  colorCustom: boolean;
  color?: any;
}

export interface DotTopology {
  readonly dotShape: string;
  readonly dotTransform: (node: GridNode) => string;
  readonly dotFill: (node: GridNode) => any;
}


/**
 * Helper section
 * @param dotParams
 */

// Domain represents the input channel value.
const getDomain = (ch: imgCh.Channel) => {
    switch (ch) {
      case imgCh.Channel.Red:
      case imgCh.Channel.Green:
      case imgCh.Channel.Blue:
        return [0, 255];
      case imgCh.Channel.Saturation:
      case imgCh.Channel.Lightness:
      case imgCh.Channel.Cyan:
      case imgCh.Channel.Magenta:
      case imgCh.Channel.Yellow:
      case imgCh.Channel.Black:
        return [0, 1];
      default:
        return [0, 1];
    }
  };

// Range represents the output size value for the shape.
const getRange = (dotParams: DotParameters) => {
  // Size = Area.
  // Lets determine which max area to cover a whole bin for each shape.
  const maxArea = dotp.getMaxCoverArea(dotParams.shape);
  const inverted = ((dotParams.sizeBinding === imgCh.Channel.Lightness) ||
                    (dotParams.sizeBinding === imgCh.Channel.Luminance)) ? true : false;
  // Apply size thresholds.
  const maxRange = maxArea * dotParams.sizeMaxThreshold;
  const minRange = 0 + dotParams.sizeMinThreshold;

  return inverted ? [maxRange, minRange] : [maxRange, maxArea];
};

// Scale for Dot size adjustment.
function CreateSizeScale(dotParams: DotParameters) {
  return d3.scaleSqrt()
    .domain(getDomain(dotParams.sizeBinding))
    .range(getRange(dotParams));
}

// It creates an extractor function to get a specific channel value
// from RGB pixel.
function CreateChExtractor(ch: imgCh.Channel) {
  switch (ch) {
    case imgCh.Channel.RGB:
    case imgCh.Channel.HSL:
    case imgCh.Channel.CMYK:
    case imgCh.Channel.Hue:
      // [RGB, HSL, CMYK] Unsupported multi-channel values for size binding.
      // [HUE] Doesn't make sense as it is qualitative not quantitative.
      // Lets consider Lightness channel for these cases.
      return imgCh.CreateChExtractorForRGB(imgCh.Channel.Lightness);
    default:
      return imgCh.CreateChExtractorForRGB(ch);
  }
}

// Retrieves the dot foreground color.
function CreateFillColor(dotParams: DotParameters) {
  if (dotParams.colorCustom) {
    return dotParams.color;
  } else {
    return (node: GridNode) => chroma(...node.rgb, "rgb").css("rgb");
  }
}

/**
 * Dot Topology Factory. A dot topology is an object providing necessary
 * methods to dinamically draw a shape.
 * @function CreateDotTopology
 * @param  {DotParameters} dotParams: DotParameters {Dot setup parameters.}
 * @return {DotTopology} {The generated dot topology.}
 */
export function CreateDotTopology(dotParams: DotParameters): DotTopology {
  const rawShape = dotp.CreateDotShape(dotParams.shape);
  const sizeScale = CreateSizeScale(dotParams);
  const chExtForSize = CreateChExtractor(dotParams.sizeBinding);
  const rotateString = dotParams.rotationAngle !== 0 ? `rotate(${dotParams.rotationAngle})` : "";
  const fillColor = CreateFillColor(dotParams);

  const dotTopology: DotTopology = {
    dotShape: rawShape.size( (node: GridNode) => sizeScale((chExtForSize as any)(...node.rgb)) ),
    dotTransform: (node: GridNode) => `translate(${node.x}, ${node.y}) ${rotateString}`,
    dotFill: fillColor,
  };
  return dotTopology;
}
