/**
 * Interface Export.
 * @public
 */

export enum GridPatternType {
  Square = 1,
  Brick,
  Triangle,
  Hex,
}

export interface GridPattern {
    readonly deltaLine: (li: number) => any;
    readonly deltaPosition: (pi: number) => number;
    readonly varianceLine: (li: number, pi: number) => number;
    readonly variancePosition: (li: number, pi: number) => number;
    readonly linesPerUnit: number;
    readonly positionsPerUnit: number;
}

/**
 * Grid pattern definition objects.
 * @private
 */

// REGULAR SQUARE PATTERN.
const squarePattern: GridPattern = {
  deltaLine: (li) => li,
  deltaPosition: (pi) => pi,
  varianceLine: (li, pi) => 0,
  variancePosition: (li, pi) => 0,
  linesPerUnit: 1,
  positionsPerUnit: 1,
};

// BRICK PATTERN.
const brickPattern: GridPattern = {
  deltaLine: (li) => li,
  deltaPosition: (pi) => pi,
  varianceLine: (li, pi) => 0,
  variancePosition: (li, pi) => (li % 2) / 2,
  linesPerUnit: 1,
  positionsPerUnit: 1,
};

// TIRANGLE PATTERN.
// Isosceles: h = s * sqrt(3) / 2
const triangleSide = 1;
const triangleHeight = triangleSide * Math.sqrt(3) / 2;

const trianglePattern: GridPattern = {
  deltaLine: (li) => li * triangleHeight,
  deltaPosition: (pi) => pi,
  varianceLine: (li, pi) => 0,
  variancePosition: (li, pi) => -(li % 2) / 2,
  linesPerUnit: 1 / (triangleHeight),
  positionsPerUnit: 1,
};

// HEXAGONAL PATTERN.
// s = h/sqrt(3)
// h = (√3)s
// d = 2s
// r = d/2 = s
const hexHeight = 1;
const hexHalfHeight = hexHeight / 2;
const hexSide = hexHeight / Math.sqrt(3);
const hexHalfSide = hexSide / 2;
const circTriangleHeight = (3 / 2) * hexSide;    // Height of the equilateral circumscribed triangle.

const hexPattern: GridPattern = {
  deltaLine: (li) => {
    const oddDelta = (li >= 0) ? hexHalfSide : hexSide;
    return Math.trunc(li / 2) * circTriangleHeight + ((li % 2) * oddDelta);
  },
  deltaPosition: (pi) => pi * hexHeight,
  varianceLine: (li, pi) => 0,
  variancePosition: (li, pi) => {
    const modIndex = (li >= 0) ? (li + 1) : Math.abs(li);
    return (modIndex % 4) >= 2 ? 0 : hexHalfHeight;
  },
  linesPerUnit: 2 / circTriangleHeight,
  positionsPerUnit: 1,
};

/**
 * Grid Pattern factory. It returns a grid pattern definition object.
 * @function CreateGridPattern
 * @param  {GridPatternType} type: GridPatternType {Type of grid pattern/latice}
 * @return {GridPattern} {GridPattern definition object}
 */
export function CreateGridPattern(type: GridPatternType): GridPattern {
  switch (type) {
    case GridPatternType.Square:       return squarePattern;
    case GridPatternType.Brick:        return brickPattern;
    case GridPatternType.Triangle:     return trianglePattern;
    case GridPatternType.Hex:          return hexPattern;
    default:                           return squarePattern;
  }
}
