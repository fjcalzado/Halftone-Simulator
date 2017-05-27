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
  rotationAngle?: number;
  scaleFactor?: number;
  translateX?: number;
  translateY?: number;
  specificParams?: any;
  /**
   * Scale factor emulates grid resolution. However, it is smarter to
   * modify input picture resolution instead of grid scale given that
   * picture rescaling will use a proper resampling algorithm.
   */
}

export const CreateDefaultGridParams = () => {
  return {
    pattern: GridPatternType.Square,
    rotationAngle: 0,
    scaleFactor: 1,
  };
};
