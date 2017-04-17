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
  Radial,
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
 * Promote Composition from a base pattern.
 * @private
 */
const basePattern: GridPattern = {
  deltaLine: (li) => li,
  deltaPosition: (pi) => pi,
  varianceLine: (li, pi) => 0,
  variancePosition: (li, pi) => 0,
  linesPerUnit: 1,
  positionsPerUnit: 1,
  extraLines: (heightPx) => 0,
  extraPositions: (widthtPx) => 0,
};

/**
 * REGULAR SQUARE PATTERN.
 */
const squarePattern = {
  ...basePattern,
};

/**
 * BRICK PATTERN.
 */
const brickPattern: GridPattern = {
  ...basePattern,
  variancePosition: (li, pi) => (li % 2) / 2,
};

/**
 * TIRANGLE PATTERN.
 * Isosceles: h = s * sqrt(3) / 2
 */
const triangleSide = 1;
const triangleHeight = triangleSide * Math.sqrt(3) / 2;

const trianglePattern: GridPattern = {
  ...basePattern,
  deltaLine: (li) => li * triangleHeight,
  variancePosition: (li, pi) => -(li % 2) / 2,
  linesPerUnit: 1 / (triangleHeight),
};

/**
 * HEXAGONAL PATTERN.
 * Optional {radius: number} as params accepted.
 * Radius: Hexagon radius in number of dots. [0.5 ..] Min 0.5.
 * s = h/sqrt(3)
 * h = (√3)s
 * d = 2s
 * r = d/2 = s
 */
const hexPattern = (params?: any): GridPattern => {
  // Default radius value = 0.7. Min 0.5.
  const hexSide = (params && params.radius != null) ? Math.max(params.radius, 0.5) : 0.7;
  const hexHalfSide = hexSide / 2;
  const hexHeight = hexSide * Math.sqrt(3);
  const hexHalfHeight = hexHeight / 2;
  const circTriangleHeight = (3 / 2) * hexSide;    // Height of the equilateral circumscribed triangle.

  return {
    ...basePattern,
    deltaLine: (li) => {
      const oddDelta = (li >= 0) ? hexHalfSide : hexSide;
      return Math.trunc(li / 2) * circTriangleHeight + ((li % 2) * oddDelta);
    },
    deltaPosition: (pi) => pi * hexHeight,
    variancePosition: (li, pi) => {
      const modIndex = (li >= 0) ? (li + 1) : Math.abs(li);
      return (modIndex % 4) >= 2 ? 0 : hexHalfHeight;
    },
    linesPerUnit: 2 / circTriangleHeight,
    positionsPerUnit: 1 / hexHeight,
  };
};

/**
 * RANDOM PATTERN.
 * Optional {limit: number} as params accepted.
 * Limit: randomness limit in number of dots.
 */
const randomPattern = (params?: any): GridPattern => {
  // Default limit value = 1.
  const limit = (params && params.limit != null) ? params.limit : 1;
  function randomize(): number {
    return (2 * Math.random() - 1) * limit;
  }

  return {
    ...basePattern,
    varianceLine: (li, pi) => randomize(),
    variancePosition: (li, pi) => randomize(),
  };
};

/**
 * Wave PATTERN.
 * Optional {wavelength: number, amplitude: number} as params accepted.
 * Wavelength: Length of a complete wave in number of dots. [4..] Min 4.
 * Amplitude: Amplitude size in dots.
 * It is recommended Wavelenth to be a multiple of Amplitudee, e.g.: 10:1, 20:2, etc.
 * This pattern may have sampling artifacts for certain wavelenght:amplitudes.
 */
const wavePattern = (params?: any): GridPattern => {
  // This factor may serve to separate lines a bit to avoid certain
  // sampling effect.
  const lineHeight = 1.25;
  // Prerequisites.
  // Default wavelength value 30. Min 4.
  // Default amplitude value 3.
  const wavelength = (params && params.wavelength != null) ? Math.max(params.wavelength, 4) : 30;
  const wavelengthFactor = (2 * Math.PI) / wavelength;
  const amplitude = ((params && params.amplitude != null) ? params.amplitude : 3) * lineHeight;

  return {
    ...basePattern,
    deltaLine: (li) => li * lineHeight,
    varianceLine: (li, pi) => amplitude * Math.sin(wavelengthFactor * pi),
    linesPerUnit: 1 / lineHeight,
    extraLines: (heightPx) => Math.round(amplitude),
  };
};

/**
 * Chevron PATTERN.
 * Optional {length: number, amplitude: number} as params accepted.
 * Length: Length of a half a chevron pattern in number of dots. [3..] Min 3.
 * Amplitude: Amplitude size in dots.
 * It is recommended Lenth to be a multiple of Amplitude, e.g.: 6:3, 10:5, etc.
 * This pattern may have sampling artifacts for certain lenght:amplitudes.
 */
const chevronPattern = (params?: any): GridPattern => {
  // This factor may serve to separate lines a bit to avoid certain
  // sampling effect.
  const lineHeight = 1.25;
  // Prerequisites.
  // Default length value 10. Min 3.
  // Default amplitude value 5.
  const length = (params && params.length != null) ? Math.max(params.length, 3) : 10;
  const lengthFactor = length - 1;
  const doubleLengthFactor = 2 * lengthFactor;
  const amplitude = ((params && params.amplitude != null) ? params.amplitude : 5) * lineHeight;

  return {
    deltaLine: (li) => li * lineHeight,
    deltaPosition: (pi) => pi,
    varianceLine: (li, pi) => {
      const segment = pi % doubleLengthFactor;
      let chevronPosition = (pi / lengthFactor);
      // Gets just the decimal part.
      chevronPosition = chevronPosition - Math.trunc(chevronPosition);
      let variance = 1;
      if (segment < lengthFactor) { variance = chevronPosition; }
      else if (segment > lengthFactor) { variance = 1 - chevronPosition; }
      return amplitude * variance;
    },
    variancePosition: (li, pi) => 0,
    linesPerUnit: 1 / lineHeight,
    positionsPerUnit: 1,
    extraLines: (heightPx) => Math.round(amplitude),
    extraPositions: (widthtPx) => 0,
  };
};

/**
 * RADIAL PATTERN.
 * Lines -> radius.
 * Position -> arc.
 * teta = arc / r = pi / li
 */
const radialPattern = (params?: any): GridPattern => {
  const twoPi = Math.PI * 2;

  return {
    ...basePattern,
    deltaLine: (li) => 0,
    deltaPosition: (li) => 0,
    varianceLine: (li, pi) => (pi <= twoPi * li) ? li * Math.sin(pi / li) : null,
    variancePosition: (li, pi) => (pi <= twoPi * li) ? li * Math.cos(pi / li) : null,
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
    case GridPatternType.Hex:          return hexPattern(params);
    case GridPatternType.Random:       return randomPattern(params);
    case GridPatternType.Wave:         return wavePattern(params);
    case GridPatternType.Chevron:      return chevronPattern(params);
    case GridPatternType.Radial:       return radialPattern(params);
    default:                           return squarePattern;
  }
}
