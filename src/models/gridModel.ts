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
  Square = 1,
  Brick,
  Triangle,
  Hex,
  Random,
  Wave,
  Chevron,
  Radial,
}

export interface GridParameters {
  pattern: GridPatternType;
  targetWidth: number;
  targetHeight: number;
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
