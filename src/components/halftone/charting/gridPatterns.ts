export enum GridPatternTypes {
  Square = 1,
}

export interface GridPattern {
    initialLine: number;
    initialPosition: number;
    deltaLine: (li: number) => any;
    deltaPosition: (pi: number) => number;
    varianceLine: (li: number, pi: number) => number;
    variancePosition: (li: number, pi: number) => number;
}

const squarePattern = {
  initialLine: 0,
  initialPosition: 0,
  deltaLine: (li) => squarePattern.initialLine + li,
  deltaPosition: (pi) => squarePattern.initialPosition + pi,
  varianceLine: (li, pi) => 0,
  variancePosition: (li, pi) => 0,
};

export function getGridPattern(type: GridPatternTypes, params?): GridPattern {
  switch (type) {
    case GridPatternTypes.Square:       return squarePattern;
    default:                            return squarePattern;
  }
}