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
  Chevron,
}

export interface GridPattern {
    readonly deltaLine: (li: number) => any;
    readonly deltaPosition: (pi: number) => number;
    readonly varianceLine: (li: number, pi: number) => number;
    readonly variancePosition: (li: number, pi: number) => number;
    readonly linesPerUnit: number;
    readonly positionsPerUnit: number;
    readonly extraLines: (heightPx: number ) => number;
    readonly extraPositions: (widthPx: number ) => number;
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
  extraLines: (heightPx) => 0,
  extraPositions: (widthtPx) => 0,
};

// BRICK PATTERN.
const brickPattern: GridPattern = {
  deltaLine: (li) => li,
  deltaPosition: (pi) => pi,
  varianceLine: (li, pi) => 0,
  variancePosition: (li, pi) => (li % 2) / 2,
  linesPerUnit: 1,
  positionsPerUnit: 1,
  extraLines: (heightPx) => 0,
  extraPositions: (widthtPx) => 0,
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
  extraLines: (heightPx) => 0,
  extraPositions: (widthtPx) => 0,
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
  extraLines: (heightPx) => 0,
  extraPositions: (widthtPx) => 0,
};

// RANDOM PATTERN.
// Optional {limit: number} as params accepted.
// Limit: randomness limit in number of dots.
const randomPattern = (params?: any): GridPattern => {
  let limit = 1;  // Default value.
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
    extraLines: (heightPx) => 0,
    extraPositions: (widthtPx) => 0,
  };
};

// Wave PATTERN.
// Optional {wavelength: number, amplitude: number} as params accepted.
// Wavelength: Length of a complete wave in number of dots. Minimum 6 recommended.
// Amplitude: Amplitude size in dots. Recommended limited to 1 max. Sampling artifacts.
const wavePattern = (params?: any): GridPattern => {
  let wavelength = 30;  // Default value.
  if (params && params.wavelength != null) { wavelength = params.wavelength; };
  const wavelengthFactor = (2 * Math.PI) / wavelength;
  let amplitude = 3;  // Default value.
  if (params && params.amplitude != null) { amplitude = params.amplitude; };
  // This factor is needed to separate lines a bit. Otherwise the pattern
  // could no be seen due to sampling effect.
  const lineHeight = 1.5;

  return {
    deltaLine: (li) => li * lineHeight,
    deltaPosition: (pi) => pi,
    varianceLine: (li, pi) => amplitude * Math.sin(wavelengthFactor * pi),
    variancePosition: (li, pi) => 0,
    linesPerUnit: 1 / lineHeight,
    positionsPerUnit: 1,
    extraLines: (heightPx) => amplitude,
    extraPositions: (widthtPx) => 0,
  };
};

// Chevron PATTERN.
// Length: Length of a half chevron pattern in number of dots. Min 3 Recommended.
// Amplitude: Amplitude size in dots. Recommended limited to 1 max. Sampling artifacts.
const chevronPattern = (params?: any): GridPattern => {
  let lenght = 10;
  if (params && params.lenght != null) { lenght = params.lenght; };
  const lengthFactor = lenght - 1;
  const doubleLengthFactor = 2 * lengthFactor;
  let amplitude = 5;
  if (params && params.amplitude != null) { amplitude = params.amplitude; };
  // This factor is needed to separate lines a bit. Otherwise the pattern
  // could no be seen due to sampling effect.
  const lineHeight = 80;

  return {
    deltaLine: (li) => li * lineHeight,
    deltaPosition: (pi) => pi,
    varianceLine: (li, pi) => {
      const segment = pi % doubleLengthFactor;
      let variance = 1;
      if (segment < lengthFactor) { variance = pi % lengthFactor; }
      else if (segment > lengthFactor) { variance = 1 - (pi % lengthFactor); }
      return amplitude * variance;
    },
    variancePosition: (li, pi) => 0,
    linesPerUnit: 1 / lineHeight,
    positionsPerUnit: 1,
    extraLines: (heightPx) => 0,
    extraPositions: (widthtPx) => 0,
  };
};

// TODO: USE OBJECT ASSIGN OR SPREAD OPERATOR FOR PATTERN OBJECTS TO PROMOTE
// COMPOSITION AND IMPROVE EXTENDIBILITY.
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
    case GridPatternType.Chevron:      return chevronPattern(params);
    default:                           return squarePattern;
  }
}
