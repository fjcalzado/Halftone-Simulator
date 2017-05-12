import { Channel } from "./channelModel";

/**
 * Dot Model.
 * @public
 */

export enum DotType {
  Circle = 1,
  Square,
  Cross,
  Diamond,
  Star,
  Triangle,
  Wye,
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