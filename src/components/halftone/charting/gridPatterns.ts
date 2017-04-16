/**
 * Interface Export.
 * @public
 */

export enum GridPatternType {
  Square = 1,
  Brick,
  Triangle,
  Hex,
  Random,
  Wave,
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

// RANDOM PATTERN.
// Optional {limit: number} as params accepted.
// Limit: randomness limit in number of dots.
const randomPattern = (params?: any): GridPattern => {
  let limit = 1;
  if (params && params.limit) { limit = params.limit; };
  function randomize(): number {
    return (2 * Math.random() - 1) * limit;
  }

  return {
    deltaLine: (li) => li,
    deltaPosition: (pi) => pi,
    varianceLine: (li, pi) => randomize(),
    variancePosition: (li, pi) => randomize(),
    linesPerUnit: 1,
    positionsPerUnit: 1,
  };
};

// Wave PATTERN.
// Optional {wavelength: number, amplitude: number} as params accepted.
// Wavelength: Length of a complete wave in number of dots.
// Amplitude: Amplitude size [0..1]. Limited to 1.
const wavePattern = (params?: any): GridPattern => {
  let wavelenght = 10;
  if (params && params.wavelenght != null) { wavelenght = params.wavelenght; };
  const wavelenghtFactor = (2 * Math.PI) / wavelenght;
  let amplitude = 1;
  if (params && params.amplitude != null) { amplitude = (params.amplitude > 1) ? 1 : params.amplitude; };
  // Amplitude limited to 1 to avoid artifacts.

  return {
    deltaLine: (li) => li,
    deltaPosition: (pi) => pi,
    varianceLine: (li, pi) => amplitude * Math.sin(wavelenghtFactor * pi),
    variancePosition: (li, pi) => 0,
    linesPerUnit: 1,
    positionsPerUnit: 1,
  };
};

// TODO: Implement radial or spiral pattern.

/**
 * Grid Pattern factory. It returns a grid pattern definition object.
 * Optionally, setup parameters can be passed to certain grid patterns.
 * @function CreateGridPattern
 * @param {GridPatternType} type: GridPatternType {Type of grid pattern/latice.}
 * @param {any} params: any {Optional setup parameters for a specific grid pattern.}
 * @return {GridPattern} {GridPattern definition object.}
 */
export function CreateGridPattern(type: GridPatternType, params?: any): GridPattern {
  switch (type) {
    case GridPatternType.Square:       return squarePattern;
    case GridPatternType.Brick:        return brickPattern;
    case GridPatternType.Triangle:     return trianglePattern;
    case GridPatternType.Hex:          return hexPattern;
    case GridPatternType.Random:       return randomPattern(params);
    case GridPatternType.Wave:         return wavePattern(params);
    default:                           return squarePattern;
  }
}
