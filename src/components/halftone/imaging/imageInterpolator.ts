
/**
 * Interface Export.
 * @public
 */
export type InterpolationMethod = (point: {x: number, y: number}) =>
                                  Array<{x: number, y: number, weight: number}>;

export type ImageInterpolator = (point: {x: number, y: number}) => number[];

/**
 * NOT OPTIMIZED. It is done this way for the sake of better readability
 * and extensibility. There is room for optimization here in case
 * performance is not good enough.
 */

/**
 * Image Interpolator Factory.
 * WARNING: NOT OPTIMIZED. NO IMAGE EXTENT CHECKING.
 * It assumes that points passed are safe.
 * @public
 * @function CreateImageInterpolator
 * @param  {number[][][]} imgMatrix: number[][][] {Image matrix containing 3 channel array.}
 * @param  {InterpolationMethod} interpolate: InterpolationMethod {Method used to interpolate.}
 * @return {ImageInterpolator} {Interpolator function}
 */
export const CreateImageInterpolator = (imgMatrix: number[][][],
                                        interpolate: InterpolationMethod): ImageInterpolator => {
  return (point: {x: number, y: number}): number[] => {
    try {
      return interpolate(point).reduce((avg, pixel) => {
        return imgMatrix[pixel.y][pixel.x].map((ch, i) => ch * pixel.weight + avg[i]);
      }, [0, 0, 0]);
    } catch (error) {
      console.error(`[ERROR] Image Interpolator: ${error.message}`);
      throw error;
    }
  };
};

/**
 * Interpolators.
 * @public
 */

export const NearestNeighbor: InterpolationMethod = (point) => {
  return [{x: Math.trunc(point.x), y: Math.trunc(point.y), weight: 1}];
};

export const Bilinear: InterpolationMethod = (point) => {
  const xFloor = Math.trunc(point.x);
  const xCeil = Math.ceil(point.x);
  const xDecimal = point.x - xFloor;
  const yFloor = Math.trunc(point.y);
  const yCeil = Math.ceil(point.y);
  const yDecimal = point.y - yFloor;
  return [
    {x: xFloor, y: yFloor , weight: (1 - xDecimal) * (1 - yDecimal) },
    {x: xFloor, y: yCeil , weight: (1 - xDecimal) * yDecimal },
    {x: xCeil, y: yFloor , weight: xDecimal * (1 - yDecimal) },
    {x: xCeil, y: yCeil , weight: xDecimal * yDecimal },
  ];
};

// TODO: Does bicubic worth implementation? We do not need that much
// precision and performance may be reduced significantly.

