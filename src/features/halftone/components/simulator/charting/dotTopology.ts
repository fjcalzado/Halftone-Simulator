import * as d3 from "d3";

import { CreateChExtractorForRGB } from "../imaging";
import { CreateDotShape, getMaxCoverArea } from "./dotPatterns";
import { Channel } from "../../../../../models/channelModel";
import { DotType, DotParameters } from "../../../../../models/dotModel";
import { GridNode } from "../../../../../models/gridModel";

/**
 * Interface Export. Internal to component.
 * @public
 */

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
const getDomain = (ch: Channel) => {
    switch (ch) {
      case Channel.Red:
      case Channel.Green:
      case Channel.Blue:
        return [0, 255];
      case Channel.Saturation:
      case Channel.Lightness:
      case Channel.Cyan:
      case Channel.Magenta:
      case Channel.Yellow:
      case Channel.Black:
        return [0, 1];
      default:
        return [0, 1];
    }
  };

// Range represents the output size value for the shape.
const getRange = (dotParams: DotParameters) => {
  // Size = Area.
  // Lets determine which max area to cover a whole bin for each shape.
  const maxArea = getMaxCoverArea(dotParams.shape);
  const inverted = (dotParams.sizeBinding !== Channel.Cyan) ||
                   (dotParams.sizeBinding !== Channel.Magenta) ||
                   (dotParams.sizeBinding !== Channel.Yellow) ||
                   (dotParams.sizeBinding !== Channel.Black);

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
function CreateChExtractor(ch: Channel) {
  switch (ch) {
    case Channel.RGB:
    case Channel.HSL:
    case Channel.CMYK:
    case Channel.Hue:
      // [RGB, HSL, CMYK] Unsupported multi-channel values for size binding.
      // [HUE] Doesn't make sense as it is qualitative not quantitative.
      // Lets consider Lightness channel for these cases.
      return CreateChExtractorForRGB(Channel.Lightness);
    default:
      return CreateChExtractorForRGB(ch);
  }
}

// Retrieves the dot foreground color.
function CreateFillColor(dotParams: DotParameters) {
  if (dotParams.colorCustom) {
    return dotParams.color;
  } else {
    return (node: GridNode) => `rgb(${node.rgb.join(",")})`;
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
  const rawShape = CreateDotShape(dotParams.shape);
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
