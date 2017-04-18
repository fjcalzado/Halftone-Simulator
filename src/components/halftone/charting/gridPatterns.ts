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
    readonly getLineRange: (minY: number, maxY: number) => {minLine: number, maxLine: number};
    readonly getPositionRange: (minX: number, maxX: number) => {minPos: number, maxPos: number};
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
  getLineRange: (minY, maxY) => { return { minLine: Math.floor(1 * minY), 
                                           maxLine: Math.ceil(1 * maxY)}; },
  getPositionRange: (minX, maxX) => { return { minPos: Math.floor(1 * minX), 
                                               maxPos: Math.ceil(1 * maxX)}; },
}                                                                                          

/**
 * REGULAR SQUARE PATTERN.
 */
const SquarePatternFactory = (): GridPattern =>{
  return {
    ...basePattern,
  };
};

/**
 * BRICK PATTERN.
 */
const BrickPatternFactory = (): GridPattern => {
  return {
    ...basePattern,
    variancePosition: (li, pi) => (li % 2) / 2,
  };
};

/**
 * TIRANGLE PATTERN.
 * Isosceles: h = s * sqrt(3) / 2
 */
const TrianglePatternFactory = (): GridPattern => {
  const triangleSide = 1;
  const triangleHeight = triangleSide * Math.sqrt(3) / 2;
  const linesPerUnit = 1 / triangleHeight;

  return {
    ...basePattern,
    deltaLine: (li) => li * triangleHeight,
    variancePosition: (li, pi) => -(li % 2) / 2,
    getLineRange: (minY, maxY) => { return {minLine: Math.floor(linesPerUnit * minY), 
                                            maxLine: Math.ceil(linesPerUnit * maxY)}; },
  };
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
const HexPatternFactory = (params?: any): GridPattern => {
  // Default radius value = 0.7. Min 0.5.
  const hexSide = (params && params.hasOwnProperty("radius")) ? Math.max(params.radius, 0.5) : 0.7;
  const hexHalfSide = hexSide / 2;
  const hexHeight = hexSide * Math.sqrt(3);
  const hexHalfHeight = hexHeight / 2;
  const circTriangleHeight = (3 / 2) * hexSide;    // Height of the equilateral circumscribed triangle.
  const linesPerUnit = 2 / circTriangleHeight;
  const positionsPerUnit = 1 / hexHeight;

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
    getLineRange: (minY, maxY) => { return { minLine: Math.floor(linesPerUnit * minY), 
                                             maxLine: Math.ceil(linesPerUnit * maxY)}; },
    getPositionRange: (minX, maxX) => { return { minPos: Math.floor(positionsPerUnit * minX),
                                                 maxPos: Math.ceil(positionsPerUnit * maxX)}; },
  };
};

/**
 * RANDOM PATTERN.
 * Optional {limit: number} as params accepted.
 * Limit: randomness limit in number of dots.
 */
const RandomPatternFactory = (params?: any): GridPattern => {
  // Default limit value = 1.
  const limit = (params && params.hasOwnProperty("limit")) ? params.limit : 1;
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
const WavePatternFactory = (params?: any): GridPattern => {
  // This factor may serve to separate lines a bit to avoid certain
  // sampling effect.
  const lineHeight = 1.25;
  const linesPerUnit = 1 / lineHeight;
  // Prerequisites.
  // Default wavelength value 30. Min 4.
  // Default amplitude value 3.
  const wavelength = (params && params.hasOwnProperty("wavelength")) ? Math.max(params.wavelength, 4) : 30;
  const wavelengthFactor = (2 * Math.PI) / wavelength;
  const amplitude = ((params && params.hasOwnProperty("amplitude")) ? params.amplitude : 3);

  return {
    ...basePattern,
    deltaLine: (li) => li * lineHeight,
    varianceLine: (li, pi) => amplitude * Math.sin(wavelengthFactor * pi),
    getLineRange: (minY, maxY) => { return { minLine: Math.floor(linesPerUnit * (minY - amplitude)), 
                                             maxLine: Math.ceil(linesPerUnit * (maxY + amplitude))}; },
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
const ChevronPatternFactory = (params?: any): GridPattern => {
  // This factor may serve to separate lines a bit to avoid certain
  // sampling effect.
  const lineHeight = 1.25;
  const linesPerUnit = 1 / lineHeight;
  // Prerequisites.
  // Default length value 10. Min 3.
  // Default amplitude value 5.
  const length = (params && params.hasOwnProperty("length")) ? Math.max(params.length, 3) : 10;
  const lengthFactor = length - 1;
  const doubleLengthFactor = 2 * lengthFactor;
  const amplitude = ((params && params.hasOwnProperty("amplitude")) ? params.amplitude : 5) * lineHeight;

  return {
    ...basePattern,
    deltaLine: (li) => li * lineHeight,
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
    getLineRange: (minY, maxY) => { return { minLine: Math.floor(linesPerUnit * (minY - amplitude)), 
                                             maxLine: Math.ceil(linesPerUnit * (maxY + amplitude))}; },
  };
};

/**
 * RADIAL PATTERN.
 * Lines -> radius.
 * Position -> arc.
 * teta = arc / r = pi / li
 */
const RadialPatternFactory = (params?: any): GridPattern => {
  const lineHeight = 2.5;
  const linesPerUnit = 1 / lineHeight;
  const twoPi = Math.PI * 2;


  return {
    ...basePattern,
    deltaLine: (li) => 0,
    deltaPosition: (li) => 0,
    varianceLine: (li, pi) => (pi <= twoPi * li) ? li * Math.sin(pi / li) : null,
    variancePosition: (li, pi) => (pi <= twoPi * li) ? li * Math.cos(pi / li) : null,
    getLineRange: (minY, maxY) => { return { minLine: Math.floor(linesPerUnit * minY), 
                                             maxLine: Math.ceil(linesPerUnit * maxY)}; },
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
    case GridPatternType.Square:       return SquarePatternFactory();
    case GridPatternType.Brick:        return BrickPatternFactory();
    case GridPatternType.Triangle:     return TrianglePatternFactory();
    case GridPatternType.Hex:          return HexPatternFactory(params);
    case GridPatternType.Random:       return RandomPatternFactory(params);
    case GridPatternType.Wave:         return WavePatternFactory(params);
    case GridPatternType.Chevron:      return ChevronPatternFactory(params);
    case GridPatternType.Radial:       return RadialPatternFactory(params);
    default:                           return SquarePatternFactory();
  }
}
