import { LayerStack } from "./layerModel";

/**
 * Preset Model.
 * @public
 */

export interface Preset {
  name: string;
  description: string;
  thumbnailUrl: string;
  layerStackJSON: any;
  customBackgroundColor: boolean;
  backgroundColor: any;
}

export type PresetCollection = Preset[];
