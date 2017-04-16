
/**
 * Interface Export.
 * @public
 */
export type InterpolationMethod = (point: {x: number, y: number}) =>
                                  Array<{x: number, y: number, weight: number}>;

// NOT OPTIMIZED FOR Nearest Neighbor. It is done this way for the sake
// of better readability and extensibility. There is room for optimization
// here in case performance is not good enough.
export const CreateImageInterpolator = (imgMatrix: any[][], interpolate: InterpolationMethod) =>
                                (point: {x: number, y: number}) => {
  try {
    return interpolate(point).reduce((avg, pixel) => {
    return imgMatrix[pixel.y][pixel.x].map((ch, i) => ch * pixel.weight + avg[i]);
  }, [0, 0, 0]);
  } catch (error) {
    console.error(`[ERROR] ImageInterpolator: ${error}`);
    throw error;
  }
};

function weightColor(color: number[], weight: number) {
  return color.map((component) => component * weight);
}

/**
 * Interpolators.
 * @public
 */
export const NearestNeighbor: InterpolationMethod = (point) => {
  return [{x: Math.trunc(point.x), y: Math.trunc(point.y), weight: 1}];
};

// TODO: Implement bilinear interpolator.

