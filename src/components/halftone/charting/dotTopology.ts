import chroma from "chroma-js";
import * as d3 from "d3";

import * as img from "../imaging";
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
  sizeBinding: img.Channel;
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
const getDomain = (ch: img.Channel) => {
    switch (ch) {
      case img.Channel.Red:
      case img.Channel.Green:
      case img.Channel.Blue:
        return [0, 255];
      case img.Channel.Saturation:
      case img.Channel.Lightness:
      case img.Channel.Cyan:
      case img.Channel.Magenta:
      case img.Channel.Yellow:
      case img.Channel.Black:
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
  const inverted = ((dotParams.sizeBinding === img.Channel.Lightness) ||
                    (dotParams.sizeBinding === img.Channel.Luminance)) ? true : false;
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
function CreateChExtractor(ch: img.Channel) {
  switch (ch) {
    case img.Channel.RGB:
    case img.Channel.HSL:
    case img.Channel.CMYK:
    case img.Channel.Hue:
      // [RGB, HSL, CMYK] Unsupported multi-channel values for size binding.
      // [HUE] Doesn't make sense as it is qualitative not quantitative.
      // Lets consider Lightness channel for these cases.
      return img.CreateChExtractorForRGB(img.Channel.Lightness);
    default:
      return img.CreateChExtractorForRGB(ch);
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
