/**
 * Grid Model.
 * @public
 */

export interface GridNode {
  x: number;
  y: number;
  rgb?: number[];
}

export enum GridPatternType {
  Square = "Square" as any,
  Brick = "Brick" as any,
  Triangle = "Triangle" as any,
  Hex = "Hex" as any,
  Random = "Random" as any,
  Wave = "Wave" as any,
  Chevron = "Chevron" as any,
  Radial = "Radial" as any,
}

export interface GridParameters {
  pattern: GridPatternType;
  rotationAngle: number;
  scaleFactor: number;
  specificParams: any;
  translateX?: number;
  translateY?: number;
  /**
   * Scale factor emulates grid resolution. However, it is smarter to
   * modify input picture resolution instead of grid scale given that
   * picture rescaling will use a proper resampling algorithm.
   */
}

export const CreateDefaultSpecificParams = (pattern: GridPatternType): any => {
  switch (pattern) {
    case GridPatternType.Hex:
      return {radius: 0.7};
    case GridPatternType.Random:
      return {limit: 1};
    case GridPatternType.Wave:
      return {wavelength: 30, amplitude: 3};
    case GridPatternType.Chevron:
      return {length: 10, amplitude: 5};
    default:
      return null;
  }
};

export const CreateDefaultGridParams = () => {
  return {
    pattern: GridPatternType.Square,
    rotationAngle: 0,
    scaleFactor: 1,
    specificParams: CreateDefaultSpecificParams(GridPatternType.Square),
  };
};
