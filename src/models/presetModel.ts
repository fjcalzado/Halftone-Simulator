import { LayerStack } from "./layerModel";

/**
 * Preset Model.
 * @public
 */

export interface Preset {
  name: string;
  description: string;
  thumbnailUrl: string;
  json: any;
}

export type PresetCollection = Preset[];
