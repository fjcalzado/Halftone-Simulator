export enum GridPatternTypes {
  Square = 1,
  Brick,
  Triangle,
  Hex,
}

export interface GridPattern {
    initialLine: number;
    initialPosition: number;
    readonly deltaLine: (li: number) => any;
    readonly deltaPosition: (pi: number) => number;
    readonly varianceLine: (li: number, pi: number) => number;
    readonly variancePosition: (li: number, pi: number) => number;
    readonly linesPerPxFactor: (height: number) => number;
    readonly positionsPerPxFactor: (width: number) => number;
}

// REGULAR SQUARE PATTERN.
const squarePattern = {
  initialLine: 0,
  initialPosition: 0,
  deltaLine: (li) => squarePattern.initialLine + li,
  deltaPosition: (pi) => squarePattern.initialPosition + pi,
  varianceLine: (li, pi) => 0,
  variancePosition: (li, pi) => 0,
  linesPerPxFactor: (height) => 1,
  positionsPerPxFactor: (width) => 1,
};

// BRICK PATTERN.
const brickPattern = {
  initialLine: 0,
  initialPosition: 0,
  deltaLine: (li) => brickPattern.initialLine + li,
  deltaPosition: (pi) => brickPattern.initialPosition + pi,
  varianceLine: (li, pi) => 0,
  variancePosition: (li, pi) => -(li % 2) / 2,
  linesPerPxFactor: (height) => 1,
  positionsPerPxFactor: (width) => 1,
};

// TIRANGLE PATTERN.
// Isosceles: h = s * sqrt(3) / 2
const triangleSide = 1;
const triangleHeight = triangleSide * Math.sqrt(3) / 2;

const trianglePattern = {
  initialLine: 0,
  initialPosition: 0,
  deltaLine: (li) => trianglePattern.initialLine + (li * triangleHeight),
  deltaPosition: (pi) => trianglePattern.initialPosition + pi,
  varianceLine: (li, pi) => 0,
  variancePosition: (li, pi) => -(li % 2) / 2,
  linesPerPxFactor: (height) => 1 / (triangleHeight),
  positionsPerPxFactor: (width) => 1,
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
const circTriangleHeight = triangleHeight * hexHeight;
const oddLineHeight = 2 * hexSide - circTriangleHeight;

const hexPattern = {
  initialLine: -0.5,
  initialPosition: 0,
  deltaLine: (li) => hexPattern.initialLine + (Math.trunc(li / 2) * circTriangleHeight) + ((li % 2) * oddLineHeight),
  deltaPosition: (pi) => hexPattern.initialPosition + (pi * hexHeight),
  varianceLine: (li, pi) => 0,
  variancePosition: (li, pi) => ((li + 1) % 4) >= 2 ? -hexHalfHeight : 0,
  linesPerPxFactor: (height) => 6 / 1.5*hexSide,
  positionsPerPxFactor: (width) => 1,
};

export function getGridPattern(type: GridPatternTypes): GridPattern {
  switch (type) {
    case GridPatternTypes.Square:       return squarePattern;
    case GridPatternTypes.Brick:        return brickPattern;
    case GridPatternTypes.Triangle:     return trianglePattern;
    case GridPatternTypes.Hex:          return hexPattern;
    default:                            return squarePattern;
  }
}