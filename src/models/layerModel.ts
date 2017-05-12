import { GridParameters } from "./gridModel";
import { DotParameters } from "./dotModel";

/**
 * Layer Model.
 * @public
 */

export interface LayerParameters {
  name: string;
  opacity: number;
  zIndex: number;
  gridParams: GridParameters;
  dotParams: DotParameters;
}

export type LayerStack = LayerParameters[];
