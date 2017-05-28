import { Channel } from "./channelModel";

/**
 * Dot Model.
 * @public
 */

export enum DotType {
  Circle = "Circle" as any,
  Square = "Square" as any,
  Cross = "Cross" as any,
  Diamond = "Diamond" as any,
  Star = "Star" as any,
  Triangle = "Triangle" as any,
  Wye = "Wye" as any,
  // TODO: Ellipse, Heart, etc
}

export interface DotParameters {
  shape: DotType;
  sizeBinding: Channel;
  sizeMinThreshold: number;
  sizeMaxThreshold: number;
  rotationAngle: number;
  colorCustom: boolean;
  color?: any;
}

export const CreateDefaultDotParams = () => {
  return {
    shape: DotType.Circle,
    sizeBinding: Channel.Lightness,
    sizeMinThreshold: 0,
    sizeMaxThreshold: 1,
    rotationAngle: 0,
    colorCustom: false,
    color: "rgb(0, 0, 0)",
  };
};
